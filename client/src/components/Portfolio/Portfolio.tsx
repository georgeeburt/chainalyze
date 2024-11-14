import { useState, useEffect } from 'react';
import useMetadata from '../../hooks/useMetadata';
import useDiscoverSocket from '../../hooks/useDiscoverSocket';
import type Token from '../../types/api/Token';
import type { Metadata } from '../../types/api/Metadata';
import type PortfolioToken from '../../types/api/Portfolio';
import type { PriceData } from '../../types/sockets/PriceData';

// Import components
import PortfolioHeader from './PortfolioHeader';
import CurrentHoldings from './CurrentHoldings';
import AddTokenForm from './AddTokenForm';
import PortfolioStats from './PortfolioStats';
import DonutPortfolioChart from './DonutPortfolioChart';
import BarPortfolioChart from './BarPortfolioChart';
import MessageToast from '../common/MessageToast';
import Loading from '../common/Loading';

const Portfolio = () => {
  // Core state
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [userPortfolio, setUserPortfolio] = useState<PortfolioToken['holdings']>([]);
  const [tokenMetadata, setTokenMetadata] = useState<{ [key: string]: Metadata }>({});
  const [loading, setLoading] = useState(true);

  // UI state
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  // Portfolio value state
  const [totalValue, setTotalValue] = useState<number>(0);
  const [valueChange, setValueChange] = useState<{ amount: number; percentage: number }>({
    amount: 0,
    percentage: 0
  });
  const [topEarner, setTopEarner] = useState<string | null>(null);

  // Chart data state
  const [donutChartData, setDonutChartData] = useState<{
    holdings: PortfolioToken['holdings'];
    tokens: Record<string, Token>;
    prices: Record<string, PriceData>;
  }>({
    holdings: [],
    tokens: {},
    prices: {}
  });

  // Hooks
  const { getBatchMetadata } = useMetadata();
  const portfolioTokens = userPortfolio
    .map(holding => tokenList.find(token => token.symbol === holding.token.symbol))
    .filter((token): token is Token => token !== undefined);
  const livePriceData = useDiscoverSocket(portfolioTokens);

  const baseUrl = 'http://localhost:3001';

  // Handlers
  const handleDeleteToken = async (tokenName: string) => {
    try {
      const response = await fetch(`${baseUrl}/portfolio`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tokenName })
      });

      if (!response.ok) {
        showMessage('Failed to delete token from portfolio.', 'error');
      } else {
        showMessage('Token successfully deleted.', 'success');
        const updatedPortfolio = userPortfolio.filter(
          item => item.token.name !== tokenName
        );
        setUserPortfolio(updatedPortfolio);
        updateChartData(updatedPortfolio);
      }
    } catch (error) {
      console.error('Error deleting token from Portfolio:', error);
      showMessage('Error deleting token from portfolio.', 'error');
    }
  };

  const handleAddToken = async (selectedToken: string, quantity: number) => {
    const selectedTokenObj = tokenList.find(token => token.symbol === selectedToken);
    if (!selectedTokenObj) {
      showMessage('Token not found.', 'error');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedTokenObj.name,
          symbol: selectedTokenObj.symbol,
          quantity
        })
      });

      if (!response.ok) {
        showMessage('Failed to add token to Portfolio.', 'error');
      } else {
        showMessage('Token successfully added to Portfolio!', 'success');
        const updatedPortfolio = [...userPortfolio, { token: selectedTokenObj, quantity }];
        setUserPortfolio(updatedPortfolio);
        updateChartData(updatedPortfolio);

        if (selectedTokenObj.id) {
          const newMetadata = await getBatchMetadata(selectedTokenObj.id.toString());
          setTokenMetadata(prev => ({ ...prev, ...newMetadata }));
        }
      }
    } catch (error) {
      console.error('Error adding token to portfolio:', error);
      showMessage('Error adding token to portfolio.', 'error');
    }
  };

  // Helper functions
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setIsMessageVisible(true);
    setTimeout(() => setIsMessageVisible(false), 3000);
    setTimeout(() => {
      setMessage(null);
      setMessageType(null);
    }, 3500);
  };

  const updateChartData = (portfolio: PortfolioToken['holdings']) => {
    setDonutChartData({
      holdings: portfolio,
      tokens: tokenList.reduce((acc, token) => {
        acc[token.symbol] = token;
        return acc;
      }, {} as Record<string, Token>),
      prices: livePriceData
    });
  };

  // Effects
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch tokens
        const tokensResponse = await fetch(`${baseUrl}/api/tokens`);
        const tokensData = await tokensResponse.json();
        setTokenList(tokensData.data);

        // Fetch portfolio
        const portfolioResponse = await fetch(`${baseUrl}/portfolio`);
        const portfolioData = await portfolioResponse.json();

        if (portfolioData?.portfolio.holdings) {
          setUserPortfolio(portfolioData.portfolio.holdings);

          const holdingIds = portfolioData.portfolio.holdings
            .map((holding: PortfolioToken['holdings'][0]) => {
              const matchingToken = tokensData.data.find(
                (token: Token) => token.symbol === holding.token.symbol
              );
              return matchingToken?.id.toString();
            })
            .filter(Boolean);

          if (holdingIds.length > 0) {
            const metadata = await getBatchMetadata(holdingIds.join(','));
            setTokenMetadata(metadata);
          }
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        showMessage('Error loading portfolio data.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (userPortfolio.length && livePriceData) {
      calculatePortfolioValues();
      updateChartData(userPortfolio);
    }
  }, [userPortfolio, livePriceData]);

  const calculatePortfolioValues = () => {
    const newTotalValue = userPortfolio.reduce((total, holding: PortfolioToken['holdings'][0]) => {
      const priceInfo = livePriceData[holding.token.symbol + 'USDT'] || livePriceData[holding.token.symbol];
      if (priceInfo?.price) {
        return total + holding.quantity * priceInfo.price;
      }
      return total;
    }, 0);

    const changes = userPortfolio.reduce<{ totalChange: number; previousTotal: number }>(
      (acc, holding: PortfolioToken['holdings'][0]) => {
        const priceInfo = livePriceData[holding.token.symbol + 'USDT'] || livePriceData[holding.token.symbol];
        if (priceInfo?.price && priceInfo?.priceChange) {
          const currentValue = holding.quantity * priceInfo.price;
          const previousValue = currentValue / (1 + priceInfo.priceChange / 100);
          return {
            totalChange: acc.totalChange + (currentValue - previousValue),
            previousTotal: acc.previousTotal + previousValue
          };
        }
        return acc;
      },
      { totalChange: 0, previousTotal: 0 }
    );

    const percentageChange = changes.previousTotal > 0
      ? ((newTotalValue - changes.previousTotal) / changes.previousTotal) * 100
      : 0;

    setTotalValue(newTotalValue);
    setValueChange({
      amount: changes.totalChange,
      percentage: percentageChange
    });

    // Calculate top earner
    const newTopEarner = userPortfolio.reduce<string | null>((top, holding: PortfolioToken['holdings'][0]) => {
      const priceInfo = livePriceData[holding.token.symbol + 'USDT'] || livePriceData[holding.token.symbol];
      if (priceInfo && typeof priceInfo.priceChange === 'number') {
        return !top || priceInfo.priceChange > (livePriceData[top + 'USDT']?.priceChange ?? 0)
          ? holding.token.name
          : top;
      }
      return top;
    }, null);

    setTopEarner(newTopEarner);
};

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
      <MessageToast
        message={message}
        type={messageType}
        isVisible={isMessageVisible}
      />

      <div className="flex flex-col gap-6 px-[15%] py-[2%] h-full">
        <PortfolioHeader />

        <div className="flex gap-6">
          <CurrentHoldings
            holdings={userPortfolio}
            tokenMetadata={tokenMetadata}
            prices={livePriceData}
            onDeleteToken={handleDeleteToken}
          />

          <AddTokenForm
            tokenList={tokenList}
            onSubmit={handleAddToken}
          />
        </div>

        <div className="flex flex-col gap-6 bg-lightnav dark:bg-darkbtn border-2 dark:border-darkborder rounded-lg p-8">
          <h2 className="text-5xl font-semibold">Portfolio Insights</h2>
          <div className="flex gap-16">
            <div className="flex flex-col gap-6 bg-lightlisthov dark:bg-darkbtnhov border-2 border-gray-300 dark:border-darkborder rounded-lg p-8 w-3/6">
              <PortfolioStats
                totalValue={totalValue}
                valueChange={valueChange}
                topEarner={topEarner}
              />
              <BarPortfolioChart
                userPortfolio={userPortfolio}
                prices={livePriceData}
              />
            </div>

            <div className="flex flex-col bg-lightlisthov dark:bg-darkbtnhov rounded-lg border-2 border-gray-300 dark:border-darkborder p-8 w-3/6">
              <h2 className="text-4xl font-semibold">Portfolio Distribution</h2>
              <div className="flex mt-auto mb-auto">
                <DonutPortfolioChart
                  userPortfolio={donutChartData.holdings}
                  tokens={donutChartData.tokens}
                  prices={donutChartData.prices}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
