import { useState, useEffect } from 'react';
import Token from '../../types/api/Token';
import Metadata from '../../types/api/Metadata';
import TokenListItem from './TokenListItem';
import { PriceData } from '../../types/sockets/PriceData';
import useTradeSocket from '../../hooks/useTradeSocket';

const TokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  // Use custom hook to get live price data
  const livePriceData = useTradeSocket(tokens);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tokens
        const response = await fetch('http://localhost:3001/api/tokens');
        if (!response.ok) throw new Error('Failed to fetch tokens');
        const tokenData = await response.json();
        setTokens(tokenData.data);

        // Fetch token metadata
        const tokenIds = tokenData.data
          .map((token: Token) => token.id)
          .join(',');
        const metadataResponse = await fetch(
          `http://localhost:3001/api/metadata?id=${tokenIds}`
        );
        const metadataData = await metadataResponse.json();
        setMetadata(
          tokenData.data.map(
            (token: Token) => metadataData.data[token.id] || null
          )
        );

        const priceData = tokenData.data.reduce(
          (acc: Record<string, PriceData>, token: Token) => {
            acc[token.symbol] = {
              price: token.quote.USD.price,
              marketCap: token.quote.USD.market_cap,
              priceChange: token.quote.USD.percent_change_24h
            };
            return acc;
          },
          {}
        );
        setPrices(priceData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <table className="table-auto w-full text-left border-separate border-spacing-y-[2vh]">
      <thead>
        <tr>
          <th className="pl-4 w-1/12">#</th>
          <th className="pl-4 w-3/12">Name</th>
          <th className="w-2/12">Price</th>
          <th className="w-3/12">Market Cap</th>
          <th className="w-/12">Price Change (24h)</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, index) => {
          const tokenMetadata = metadata[index];
          const priceInfo =
            prices[token.symbol + 'USDT'] || prices[token.symbol];
          return (
            <TokenListItem
              key={token.id}
              token={token}
              metadata={tokenMetadata}
              rank={index + 1}
              priceData={priceInfo}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default TokenList;
