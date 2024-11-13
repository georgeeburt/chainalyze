import { useEffect, useState, useRef } from 'react';
import { PriceData } from '../types/sockets/PriceData';
import Token from '../types/api/Token';
import PortfolioToken from '../types/api/Portfolio';

type Holding = PortfolioToken['holdings'][0];

const useDiscoverSocket = (input: Token[] | Holding[]) => {
  const [priceData, setPriceData] = useState<Record<string, PriceData>>({});
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (input.length === 0) return;

    // Create the stream URL
    const streamUrl = `wss://stream.binance.com:9443/ws/${input
      .map(item => {
        const symbol = 'symbol' in item ? item.symbol : item.token.symbol;
        return `${symbol.toLowerCase()}usdt@ticker`;
      })
      .join('/')}`;

    // If we already have a connection with the same URL, don't reconnect
    if (socketRef.current?.url === streamUrl && socketRef.current.readyState === WebSocket.OPEN) {
      return;
    }

    // Close existing connection if URL changed
    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket(streamUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connection opened');

      // Initialize price data with current token data
      const initialPrices: Record<string, PriceData> = {};
      input.forEach(item => {
        const symbol = 'symbol' in item ? item.symbol : item.token.symbol;
        if ('quote' in item) {
          initialPrices[symbol + 'USDT'] = {
            price: item.quote.USD.price,
            marketCap: item.quote.USD.market_cap,
            priceChange: item.quote.USD.percent_change_24h,
          };
        }
      });
      setPriceData(initialPrices);
    };

    socket.onmessage = event => {
      const data = JSON.parse(event.data);

      if (data.ping) {
        socket.send(JSON.stringify({ pong: data.ping }));
        return;
      }

      if (data.e === '24hrTicker') {
        const item = input.find(i => {
          const symbol = 'symbol' in i ? i.symbol : i.token.symbol;
          return (symbol + 'USDT') === data.s;
        });

        if (item) {
          setPriceData(prevData => ({
            ...prevData,
            [data.s]: {
              price: parseFloat(data.c),
              marketCap: parseFloat(data.c) * (
                'circulating_supply' in item
                  ? item.circulating_supply
                  : item.quantity
              ),
              priceChange: parseFloat(data.P)
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
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      socketRef.current = null;
    };
  }, [input]);

  return priceData;
};

export default useDiscoverSocket;