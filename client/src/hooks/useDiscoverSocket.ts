import { useEffect, useState } from 'react';
import Token from '../types/api/Token';
import { PriceData } from '../types/sockets/PriceData';

const useDiscoverSocket = (tokens: Token[]) => {
  const [priceData, setPriceData] = useState<Record<string, PriceData>>({});
  useEffect(() => {
    if (tokens.length === 0) return;

    const streamUrl = `wss://stream.binance.com:9443/ws/${tokens
      .map(token => `${token.symbol.toLowerCase()}usdt@ticker`)
      .join('/')}`;
    const socket = new WebSocket(streamUrl);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);

      if (data.ping) {
        socket.send(JSON.stringify({ pong: data.ping }));
        return;
      }

      if (data.e === '24hrTicker') {
        // Find the circulating supply for the token
        const token = tokens.find(token => token.symbol + 'USDT' === data.s);
        if (token) {
          const price = parseFloat(data.c);
          const marketCap = price * token.circulating_supply;
          setPriceData(prevData => ({
            ...prevData,
            [data.s]: {
              price: price,
              marketCap: marketCap,
              priceChange: data.P
            }
          }));
        }
      }
    };

    socket.onerror = error => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, [tokens]);

  return priceData;
};

export default useDiscoverSocket;