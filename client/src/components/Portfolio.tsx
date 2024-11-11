import React, { useEffect, useState } from 'react';
import Token from '../types/api/Token';
import PortfolioToken from '../types/api/Portfolio';

const Portfolio = () => {
  // State variables
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [userPortfolio, setUserPortfolio] = useState<
    PortfolioToken['holdings']
  >([]);
  const [selectedToken, setSelectedToken] = useState('none');
  const [quantity, setQuantity] = useState<number | string>('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(
    null
  );
  const [isMessageVisible, setIsMessageVisible] = useState(false);

  const baseUrl = 'http://localhost:3001';

  // Selected token input handler
  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
  };

  // Quantity change handler
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  // Delete token Handler
  const handleDeleteToken = async (tokenName: string) => {
    try {
      const response = await fetch(`${baseUrl}/portfolio`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: tokenName }),
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

        setUserPortfolio(prevPortfolio => [
          ...prevPortfolio,
          { token: selectedTokenObj, quantity: quantityValue }
        ]);
      }

      setSelectedToken('none');
      setQuantity('');
    } catch (error) {
      console.error('Error adding token to portfolio:', error);
      setMessage('Error adding token to portfolio.');
      setMessageType('error');
    }
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`${baseUrl}/portfolio`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const responseData = await response.json();
        if (responseData?.portfolio.holdings)
          setUserPortfolio(responseData.portfolio.holdings);
      } catch (error) {
        console.error('Error fetching user portfolio:', error);
      }
    };
    fetchPortfolio();
  }, []);

  // Hooks
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/tokens`);
        if (!response.ok) throw new Error('Failed to fetch tokens');
        const responseData = await response.json();
        setTokenList(responseData.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTokens();
  }, []);

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

  // Loading state
  if (loading || !tokenList) {
    return (
      <div className="flex justify-center items-center h-screen transform -translate-y-6">
        <div className="w-12 h-12 border-4 border-elixir border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render
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
        {/* Message Display */}
        <h1 className="text-6xl font-semibold">Portfolio</h1>

        <div className="flex flex-col flex-wrap gap-8 bg-lightnav dark:bg-darklabel rounded-md p-8">
          <h2 className="text-4xl">Add Tokens to Portfolio</h2>
          <form
            onSubmit={handleTokenSubmit}
            className="flex gap-4 content-center"
          >
            {/* Select Dropdown */}
            <select
              className="bg-lightlisthov text-black focus:border-elixir focus:border-2 hover:ring-1 hover:ring-elixir focus:outline-none rounded-md p-2"
              value={selectedToken}
              onChange={handleTokenChange}
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

            {/* Quantity Input */}
            <input
              type="number"
              className="bg-lightlisthov text-black border-2 focus:border-elixir hover:ring-1 hover:ring-elixir focus:outline-none rounded-md p-2"
              placeholder="Enter quantity"
              min="1"
              value={quantity}
              onChange={handleQuantityChange}
            />

            {/* Add Token Button */}
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
            userPortfolio.map((holding, index) => (
              <div className="flex gap-4" key={index}>
                <p>
                  {/* Render token name and symbol separately */}
                  {holding?.token?.name} ({holding?.token?.symbol}) - Quantity:{' '}
                  {holding.quantity}
                </p>
                <svg
                  onClick={() => handleDeleteToken(holding.token.name)} // Use token symbol to delete
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
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Portfolio;
