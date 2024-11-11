import { useEffect, useState } from 'react';
import Token from '../types/api/Token';
import Metadata from '../types/api/Metadata';

const Portfolio = () => {
  const [tokenList, setTokenList] = useState<Token[]>([]);
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [selectedToken, setSelectedToken] = useState('none');
  const [quantity, setQuantity] = useState<number | string>('');

  const handleTokenChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedToken(event.target.value);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(event.target.value);
  };

  useEffect(() => {
    const fetchTokens = async () => {
      const baseUrl = 'http://localhost:3001/api/';
      try {
        // Fetch list of tokens
        const response = await fetch(`${baseUrl}tokens`);
        if (!response.ok) throw new Error('Failed to fetch tokens');
        const responseData = await response.json();
        setTokenList(responseData.data);
        // Fetch Token metadata
        const tokenSymbols = responseData.data
          .map((token: Token) => token.symbol)
          .join(',');
        const metadataResponse = await fetch(`${baseUrl}metadata?symbols=${tokenSymbols}`);
        const metadataData = await metadataResponse.json();
        setMetadata(
          responseData.data.map(
            (token: Token) => metadataData.data[token.symbol] || null
          )
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchTokens();
  }, []);

  return (
    <div className="flex flex-col gap-12 px-[15%] py-[2%] h-full">
      <h1 className="text-6xl font-semibold">Portfolio</h1>

      <div className="flex flex-col gap-8">
        <div className="flex gap-4 content-center">
          {/* Select Dropdown */}
          <select
            className="bg-lightlisthov text-black rounded-md p-2"
            value={selectedToken}
            onChange={handleTokenChange}
          >
            <option value="none">Select token</option>
            {metadata
              .filter((token) => token !== null)
              .sort((a, b) => {
                if (a?.name < b?.name) return -1;
                if (a?.name > b?.name) return 1;
                return 0;
              })
              .map((token) => (
                <option key={token?.symbol} value={token?.symbol}>
                  <img src={token?.logo} alt={token?.name} className="inline-block w-6 h-6 mr-2" />
                  {token?.name} ({token?.symbol})
                </option>
              ))}
          </select>

          {/* Quantity Input */}
          <input
            type="number"
            className="bg-lightlisthov text-black rounded-md p-2"
            placeholder="Enter quantity"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
          />

          {/* Add Token Button */}
          <button className="bg-lilac dark:bg-elixir text-white p-2 rounded-md">
            Add Tokens
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <h2 className="text-4xl">Current Holdings</h2>
        <p>No current token holdings.</p>
        <ul></ul>
      </div>
    </div>
  );
};

export default Portfolio;