import React, { useEffect, useState } from 'react';
import DonutPortfolioChart from './DonutPortfolioChart';
import useMetadata from '../../hooks/useMetadata';
import useDiscoverSocket from '../../hooks/useDiscoverSocket';
import Token from '../../types/api/Token';
import PortfolioToken from '../../types/api/Portfolio';
import { PriceData } from '../../types/sockets/PriceData';
import { Metadata } from '../../types/api/Metadata';

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
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null
  );
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const portfolioTokens = userPortfolio
    .map(holding =>
      tokenList.find(token => token.symbol === holding.token.symbol)
    )
    .filter(token => token !== undefined) as Token[];

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

        // Filter portfolio state based on token name
        setUserPortfolio(prevPortfolio =>
          prevPortfolio.filter(item => item.token.name !== tokenName)
        );
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

        // Add to portfolio state
        setUserPortfolio(prevPortfolio => [
          ...prevPortfolio,
          { token: selectedTokenObj, quantity: quantityValue }
        ]);

        // Fetch and add metadata for the new token
        if (selectedTokenObj.id) {
          const newMetadata = await getBatchMetadata(
            selectedTokenObj.id.toString()
          );
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
      <div className="flex flex-col gap-12 px-[15%] py-[2%] h-full">
        <h1 className="text-6xl font-semibold">Portfolio</h1>

        <div className="flex flex-col flex-wrap gap-8 bg-lightnav dark:bg-darklabel rounded-md p-8">
          <h2 className="text-4xl">Add Tokens to Portfolio</h2>
          <form
            onSubmit={handleTokenSubmit}
            className="flex gap-4 content-center"
          >
            <select
              className="bg-lightlisthov text-black focus:border-elixir focus:border-2 hover:ring-1 hover:ring-elixir focus:outline-none rounded-md p-2"
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
              className="bg-lightlisthov text-black border-2 focus:border-elixir hover:ring-1 hover:ring-elixir focus:outline-none rounded-md p-2"
              placeholder="Enter quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityInputChange}
            />

            <button className="dark:bg-elixir bg-elixir hover:bg-grape hover:dark:bg-purple-700 text-white p-2 rounded-md">
              Add Tokens
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-8 bg-lightnav dark:bg-darkbtn rounded-lg p-8">
          <h2 className="text-4xl">Current Holdings</h2>
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
                <div className="flex items-center gap-4" key={index}>
                  {matchingMetadata?.logo && (
                    <img
                      src={matchingMetadata.logo}
                      alt={`${holding.token.name} logo`}
                      className="w-6 h-6"
                    />
                  )}
                  <p className="text-lg">
                    {holding.token.name} ({holding.token.symbol}) - Quantity:{' '}
                    {holding.quantity}
                    {priceInfo && typeof priceInfo.price === 'number' && (
                      <>
                        {' '}
                        - Total Holding Value: $
                        {totalValue.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}{' '}
                        {typeof priceInfo.priceChange === 'number' && (
                          <span
                            className={
                              priceInfo.priceChange >= 0
                                ? 'text-forest'
                                : 'text-red'
                            }
                          >
                            24h: {priceInfo.priceChange.toFixed(2)}%
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
          <div>
            <h2 className="text-4xl">Portfolio Distribution</h2>
            <DonutPortfolioChart
          userPortfolio={userPortfolio}
          tokens={tokenList.reduce((acc, token) => {
            acc[token.symbol] = token;
            return acc;
          }, {} as Record<string, Token>)}
          prices={prices}
        />
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;
