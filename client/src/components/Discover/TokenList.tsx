import { useState, useEffect } from 'react';
import type { PriceData } from '../../types/sockets/PriceData';
import type { Metadata } from '../../types/api/Metadata';
import type Token from '../../types/api/Token';

// Import components/hooks
import TokenListItem from './TokenListItem';
import Loading from '../common/Loading';
import useMetadata from '../../hooks/useMetadata';
import useDiscoverSocket from '../../hooks/useDiscoverSocket';

const TokenList = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<Record<string, PriceData>>({});

  const { getBatchMetadata } = useMetadata(); //Metadata Context
  const livePriceData = useDiscoverSocket(tokens); // Live Price data websocket hook

  // Fetch tokens
  useEffect(() => {
    let mounted = true;
    const fetchInitialData = async () => {
      const baseUrl = 'http://localhost:3001/api/';
      try {
        const response = await fetch(`${baseUrl}tokens`);
        if (!response.ok) throw new Error('Failed to fetch tokens');
        const tokenData = await response.json();
        if (!mounted) return;
        setTokens(tokenData.data);

        // Create comma-separated list of token IDs
        const tokenIds = tokenData.data
          .map((token: Token) => token.id.toString())
          .join(',');

        // Fetch metadata using context
        const metadataData = await getBatchMetadata(tokenIds);
        if (!mounted) return;

        // Map the metadata correctly to each token
        const mappedMetadata = tokenData.data.map((token: Token) => {
          const tokenMetadata = metadataData[token.id.toString()];
          return {
            id: token.id,
            logo: tokenMetadata?.logo || '',
            name: tokenMetadata?.name || '',
            symbol: token.symbol,
            urls: tokenMetadata?.urls || { website: [], technical_doc: [] },
          };
        });

        setMetadata(mappedMetadata);
        const priceData = tokenData.data.reduce(
          (acc: Record<string, PriceData>, token: Token) => {
            acc[token.symbol] = {
              price: token.quote.USD.price,
              marketCap: token.quote.USD.market_cap,
              priceChange: token.quote.USD.percent_change_24h,
            };
            return acc;
          },
          {}
        );
        setPrices(priceData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  // Handle live webhook data
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
            updatedPrices[symbol].priceChange,
        };
      });

      return updatedPrices;
    });
  }, [livePriceData]);

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
    <hr className='border-lightnav dark:border-darkborder'/>
    <table className="table-auto w-full text-left border-separate border-spacing-y-[2vh]">
      <thead>
        <tr className="text-xl">
          <th className="pl-4 w-1/12">#</th>
          <th className="pl-5 w-3/12">Name</th>
          <th className="w-2/12">Price</th>
          <th className="w-3/12">Market Cap</th>
          <th className="w-3/12">Price Change % (24h)</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token, index) => {
          const tokenMetadata = metadata[index];
          const priceInfo = prices[token.symbol + 'USDT'] || prices[token.symbol];

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
    </>
  );
};

export default TokenList;
