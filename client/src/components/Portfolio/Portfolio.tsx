import React, { useEffect, useState, useMemo } from 'react';
import DonutPortfolioChart from './DonutPortfolioChart';
import BarPortfolioChart from './BarPortfolioChart';
import useMetadata from '../../hooks/useMetadata';
import useDiscoverSocket from '../../hooks/useDiscoverSocket';
import Token from '../../types/api/Token';
import PortfolioToken from '../../types/api/Portfolio';
import { PriceData } from '../../types/sockets/PriceData';
import { Metadata } from '../../types/api/Metadata';
import { formatPrice } from '../../utils/formatters/formatPrice';
import { formatPriceChange } from '../../utils/formatters/formatPriceChange';

interface TokenMetadata {
  [key: string]: Metadata;
}

const Portfolio = () => {
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [userPortfolio, setUserPortfolio] = useState<
    PortfolioToken['holdings']
  >([]);
  const [tokenMetadata, setTokenMetadata] = useState<TokenMetadata>({});
  const [selectedToken, setSelectedToken] = useState('none');
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [quantity, setQuantity] = useState<number | string>('');
  const [totalValue, setTotalValue] = useState<number>(0);
  const [valueChange, setValueChange] = useState<{
    amount: number;
    percentage: number;
  }>({ amount: 0, percentage: 0 });
  const [previousValue, setPreviousValue] = useState<number>(0);
  const [donutChartData, setDonutChartData] = useState<{
    holdings: PortfolioToken['holdings'];
    tokens: Record<string, Token>;
    prices: Record<string, PriceData>;
  }>({
    holdings: [],
    tokens: {},
    prices: {}
  });
  const [chartData, setChartData] = useState<{
    holdings: PortfolioToken['holdings'];
    prices: Record<string, PriceData>;
  }>({
    holdings: [],
    prices: {}
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null
  );
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const portfolioTokens = useMemo(
    () =>
      userPortfolio
        .map(holding =>
          tokenList.find(token => token.symbol === holding.token.symbol)
        )
        .filter((token): token is Token => token !== undefined),
    [userPortfolio, tokenList]
  );

  // Live websocket data feed for tokens in Portfolio
  const [socketReady, setSocketReady] = useState(false);
  const livePriceData = useDiscoverSocket(portfolioTokens);
  const { getBatchMetadata } = useMetadata();
  const baseUrl = 'http://localhost:3001';

  // Selected token input handler
  const handleTokenInputChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedToken(event.target.value);
  };

  // Quantity change handler
  const handleQuantityInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQuantity(event.target.value);
  };

  // Delete token Handler
  const handleDeleteToken = async (tokenName: string) => {
    try {
      const response = await fetch(`${baseUrl}/portfolio`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: tokenName })
      });

      if (!response.ok) {
        setMessage('Failed to delete token from portfolio.');
        setMessageType('error');
      } else {
        setMessage('Token successfully deleted.');
        setMessageType('success');

        const updatedPortfolio = userPortfolio.filter(
          item => item.token.name !== tokenName
        );
        setUserPortfolio(updatedPortfolio);

        setDonutChartData({
          holdings: updatedPortfolio,
          tokens: tokenList.reduce((acc, token) => {
            acc[token.symbol] = token;
            return acc;
          }, {} as Record<string, Token>),
          prices: prices
        });

        setChartData({
          holdings: updatedPortfolio,
          prices: prices
        });
      }
    } catch (error) {
      console.error('Error deleting token from Portfolio:', error);
      setMessage('Error deleting token from portfolio.');
      setMessageType('error');
    }
  };

  // Submit token handler
  const handleTokenSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const quantityValue = Number(quantity);

    if (selectedToken === 'none' || !quantityValue || quantityValue <= 0) {
      setMessage(
        'Please make sure to select a token and enter a valid quantity.'
      );
      setMessageType('error');
      return;
    }

    const selectedTokenObj = tokenList.find(
      token => token.symbol === selectedToken
    );

    if (!selectedTokenObj) {
      setMessage('Token not found.');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selectedTokenObj.name,
          symbol: selectedTokenObj.symbol,
          quantity: quantityValue
        })
      });

      if (!response.ok) {
        setMessage('Failed to add token to Portfolio.');
        setMessageType('error');
      } else {
        setMessage('Token successfully added to Portfolio!');
        setMessageType('success');

        const updatedPortfolio = [
          ...userPortfolio,
          { token: selectedTokenObj, quantity: quantityValue }
        ];
        setUserPortfolio(updatedPortfolio);
        setDonutChartData({
          holdings: updatedPortfolio,
          tokens: tokenList.reduce((acc, token) => {
            acc[token.symbol] = token;
            return acc;
          }, {} as Record<string, Token>),
          prices: prices
        });

        setChartData({
          holdings: updatedPortfolio,
          prices: prices
        });

        if (selectedTokenObj.id) {
          const newMetadata = await getBatchMetadata(selectedTokenObj.id.toString());
          setTokenMetadata(prev => ({
            ...prev,
            ...newMetadata
          }));
        }
      }

      setSelectedToken('none');
      setQuantity('');
    } catch (error) {
      console.error('Error adding token to portfolio:', error);
      setMessage('Error adding token to portfolio.');
      setMessageType('error');
    }
  };

  // Fetch portfolio and metadata
  useEffect(() => {
    const fetchPortfolioAndMetadata = async () => {
      try {
        // Fetch all available tokens first
        const tokensResponse = await fetch(`${baseUrl}/api/tokens`);
        const tokensData = await tokensResponse.json();
        setTokenList(tokensData.data);

        // Fetch portfolio
        const portfolioResponse = await fetch(`${baseUrl}/portfolio`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const portfolioData = await portfolioResponse.json();

        if (portfolioData?.portfolio.holdings) {
          setUserPortfolio(portfolioData.portfolio.holdings);

          // Map each holding to its corresponding token data to get the IDs
          const holdingsWithIds = portfolioData.portfolio.holdings
            .map(
              (holding: {
                token: {
                  name: string;
                  symbol: string;
                };
                quantity: number;
              }) => {
                const matchingToken = tokensData.data.find(
                  (token: Token) => token.symbol === holding.token.symbol
                );
                return matchingToken ? matchingToken.id.toString() : null;
              }
            )
            .filter(Boolean);

          // If we have any valid IDs, fetch their metadata
          if (holdingsWithIds.length > 0) {
            const metadataData = await getBatchMetadata(
              holdingsWithIds.join(',')
            );
            setTokenMetadata(metadataData);
          }
        }
      } catch (error) {
        console.error('Error fetching user portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioAndMetadata();
  }, []);

  // Fetch token list for dropdown
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/tokens`);
        if (!response.ok) throw new Error('Failed to fetch tokens');
        const responseData = await response.json();
        setTokenList(responseData.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTokens();
  }, []);

  // Hook for live price data
  useEffect(() => {
    setPrices(prevPrices => {
      const updatedPrices = { ...prevPrices };
      Object.keys(livePriceData).forEach(symbol => {
        updatedPrices[symbol] = {
          ...updatedPrices[symbol],
          price: livePriceData[symbol].price ?? updatedPrices[symbol].price,
          marketCap:
            livePriceData[symbol].marketCap ?? updatedPrices[symbol].marketCap,
          priceChange:
            livePriceData[symbol].priceChange ??
            updatedPrices[symbol].priceChange
        };
      });
      return updatedPrices;
    });
  }, [livePriceData]);

  // Handle message popup
  useEffect(() => {
    if (message !== null) {
      setIsMessageVisible(true);

      const fadeOutTimer = setTimeout(() => setIsMessageVisible(false), 3000);
      const removeMessageTimer = setTimeout(() => {
        setMessage(null);
        setMessageType(null);
      }, 5000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(removeMessageTimer);
      };
    }
  }, [message]);

  // Hook to watch for initial price data
  useEffect(() => {
    if (Object.keys(livePriceData).length > 0) {
      setSocketReady(true);
    }
  }, [livePriceData]);

  useEffect(() => {
    // Calculate new total value whenever prices update
    const newTotalValue = userPortfolio.reduce((total, holding) => {
      const priceInfo =
        prices[holding.token.symbol + 'USDT'] || prices[holding.token.symbol];
      if (priceInfo?.price) {
        return total + holding.quantity * priceInfo.price;
      }
      return total;
    }, 0);

    // Calculate both monetary and percentage change for 24h
    const changes = userPortfolio.reduce(
      (acc, holding) => {
        const priceInfo =
          prices[holding.token.symbol + 'USDT'] || prices[holding.token.symbol];
        if (priceInfo?.price && priceInfo?.priceChange) {
          const currentValue = holding.quantity * priceInfo.price;
          // Calculate value 24h ago based on the percentage change
          const previousValue =
            currentValue / (1 + priceInfo.priceChange / 100);
          const valueChange = currentValue - previousValue;

          return {
            totalChange: acc.totalChange + valueChange,
            previousTotal: acc.previousTotal + previousValue
          };
        }
        return acc;
      },
      { totalChange: 0, previousTotal: 0 }
    );

    // Calculate total percentage change
    const percentageChange =
      changes.previousTotal > 0
        ? ((newTotalValue - changes.previousTotal) / changes.previousTotal) *
          100
        : 0;

    // Update states
    setTotalValue(newTotalValue);
    setValueChange({
      amount: changes.totalChange,
      percentage: percentageChange
    });
    setPreviousValue(totalValue);
  }, [prices, userPortfolio]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setChartData({
        holdings: userPortfolio,
        prices: prices
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [userPortfolio, prices]);

  const topEarner = useMemo(() => {
    return userPortfolio.reduce<string | null>((top, holding) => {
      const priceInfo =
        prices[holding.token.symbol + 'USDT'] || prices[holding.token.symbol];
      if (priceInfo && typeof priceInfo.priceChange === 'number') {
        return !top || priceInfo.priceChange > prices[top + 'USDT']?.priceChange
          ? holding.token.name
          : top;
      }
      return top;
    }, null);
  }, [userPortfolio, prices]);

  useEffect(() => {
    const updateDonutData = () => {
      setDonutChartData({
        holdings: userPortfolio,
        tokens: tokenList.reduce((acc, token) => {
          acc[token.symbol] = token;
          return acc;
        }, {} as Record<string, Token>),
        prices: prices
      });
    };
    updateDonutData();
    const interval = setInterval(updateDonutData, 30000);

    return () => clearInterval(interval);
  }, [userPortfolio, tokenList, prices]);

  if (loading || !socketReady) {
    return (
      <div className="flex justify-center items-center h-screen transform -translate-y-6">
        <div className="w-12 h-12 border-4 border-elixir border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {message && (
        <div
          className={`flex text-white items-center text-lg p-4 rounded-md text-center drop-shadow-2xl transition-opacity duration-500 ${
            isMessageVisible ? 'opacity-100' : 'opacity-0'
          } ${
            messageType === 'success' ? 'bg-forest' : 'bg-rose-500'
          } absolute top-[60px] left-1/2 transform -translate-x-1/2`}
        >
          {message}
        </div>
      )}
      <div className="flex flex-col gap-6 px-[15%] py-[2%] h-full">
        <h1 className="text-6xl font-semibold">Portfolio</h1>

        <div className="flex gap-6">
          <div className="flex flex-col gap-4 bg-lightnav dark:bg-darkbtn border-2 dark:border-darkborder rounded-lg w-10/12 p-6">
            <h2 className="text-4xl font-semibold">Current Holdings</h2>
            <div className="flex flex-wrap gap-3">
              {!userPortfolio.length ? (
                <p className="text-xl">No current token holdings.</p>
              ) : (
                userPortfolio.map((holding, index) => {
                  // Find metadata by matching token symbol
                  const matchingMetadata = Object.values(tokenMetadata).find(
                    meta => meta.symbol === holding.token.symbol
                  );
                  // Get price data for this token
                  const priceInfo =
                    prices[holding.token.symbol + 'USDT'] ||
                    prices[holding.token.symbol];
                  // Calculate total value of holding
                  const totalValue = priceInfo?.price
                    ? holding.quantity * priceInfo.price
                    : 0;
                  return (
                    <div
                      className="flex items-center bg-lightlisthov dark:bg-darkbtnhov border-2 border-gray-400 dark:border-darkborder gap-4 rounded-lg p-2"
                      key={index}
                    >
                      {matchingMetadata?.logo && (
                        <img
                          src={matchingMetadata.logo}
                          alt={`${holding.token.name} logo`}
                          className="w-6 h-6"
                        />
                      )}
                      <p className="text-lg leading-tight">
                        {holding.token.name} ({holding.token.symbol})<br />
                        <span className="text-sm dark:text-stone">
                          Quantity:{' '}
                        </span>
                        <span className="text-sm dark:text-white">
                          {holding.quantity}
                        </span>
                        {priceInfo && typeof priceInfo.price === 'number' && (
                          <>
                            <br />
                            <span className="text-sm dark:text-stone">
                              Value:{' '}
                            </span>
                            <span className="text-sm dark:text-white">
                              {'$' +
                                totalValue.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                            </span>{' '}
                            {typeof priceInfo.priceChange === 'number' && (
                              <span
                                className={
                                  priceInfo.priceChange >= 0
                                    ? 'text-forest text-sm'
                                    : 'text-red text-sm'
                                }
                              >
                                {formatPriceChange(priceInfo.priceChange.toFixed(2))}
                              </span>
                            )}
                          </>
                        )}
                      </p>
                      <svg
                        onClick={() => handleDeleteToken(holding.token.name)}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 cursor-pointer hover:text-red"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18 18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center gap-8 bg-lightnav dark:bg-darklabel border-2 dark:border-darkborder rounded-md w-4/12 p-8">
            <h2 className="text-4xl font-semibold">Add Tokens to Portfolio</h2>
            <form
              onSubmit={handleTokenSubmit}
              className="flex flex-col gap-4 content-center"
            >
              <select
                className="bg-lightlisthov dark:bg-zinc-500 text-black focus:border-elixir focus:border-2 hover:ring-1 hover:ring-elixir focus:outline-none rounded-md p-2"
                value={selectedToken}
                onChange={handleTokenInputChange}
              >
                <option value="none">Select token</option>
                {tokenList
                  .filter(token => token !== null)
                  .sort((a, b) => (a?.name < b?.name ? -1 : 1))
                  .map(token => (
                    <option key={token?.symbol} value={token?.symbol}>
                      {token?.name} ({token?.symbol})
                    </option>
                  ))}
              </select>
              <input
                type="number"
                className="bg-lightlisthov dark:bg-zinc-500 dark:placeholder-gray-800 text-black focus:border-2 focus:border-elixir hover:ring-1 hover:ring-elixir focus:outline-none rounded-md p-2"
                placeholder="Enter quantity"
                min="1"
                value={quantity}
                onChange={handleQuantityInputChange}
              />
              <button className="dark:bg-elixir bg-elixir hover:bg-grape border-2 border-purple-900 hover:dark:bg-purple-700 text-white p-2 rounded-md">
                Add Tokens
              </button>
            </form>
          </div>
        </div>
        <div className="flex flex-col gap-6 bg-lightnav dark:bg-darkbtn border-2 dark:border-darkborder rounded-lg p-8">
          <h2 className="text-5xl font-semibold">Portfolio Insights</h2>
          <div className="flex gap-16">
            <div className="flex flex-col gap-6 bg-lightlisthov dark:bg-darkbtnhov border-2 border-gray-300 dark:border-darkborder rounded-lg p-8 w-3/6">
              <h3 className="text-4xl font-semibold">Portfolio Statistics</h3>
              <div className="flex flex-col gap-3">
                <div className="flex gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <p className="font-semibold">
                    Total Value: {formatPrice(totalValue)}{' '}
                    <span
                      className={
                        valueChange.percentage < 0
                          ? 'text-red font-normal'
                          : 'text-forest font-normal'
                      }
                    >
                      {formatPriceChange(valueChange.percentage)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
                    />
                  </svg>
                  <p className="font-semibold">
                    Value Change (24hr):{' '}
                    <span
                      className={
                        valueChange.amount < 0
                          ? 'text-red font-normal'
                          : 'text-forest font-normal'
                      }
                    >
                      {valueChange.amount < 0
                        ? formatPrice(valueChange.amount)
                        : formatPrice(valueChange.amount)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
                    />
                  </svg>

                  <p className="font-semibold">
                    Top Earner (24hr):{' '}
                    <span className="font-normal">{topEarner}</span>
                  </p>
                </div>
              </div>
              <BarPortfolioChart
                userPortfolio={userPortfolio}
                prices={prices}
              ></BarPortfolioChart>
            </div>
            <div className="flex flex-col bg-lightlisthov dark:bg-darkbtnhov rounded-lg border-2 border-gray-300 dark:border-darkborder p-8 w-3/6">
                  <h2 className="text-4xl font-semibold">Portfolio Distribution</h2>
                <div className='flex mt-auto mb-auto'>
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
