import { useState, useEffect } from "react";
import type { ChartData } from "../types/sockets/ChartData";

const useChartSocket = (symbol: string) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!symbol) return;

    const socket = new WebSocket(`${import.meta.env.VITE_BINANCE_WSS_URL}/${symbol.toLowerCase() + 'usdt'}@kline_1s`);

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);

      if (receivedData.ping) {
      socket.send(JSON.stringify({ pong: receivedData.ping }));
        return;
      }

      setData((prevData) => [
        ...prevData,
        receivedData
      ]);
    };

    return () => {
      socket.close();
    };

  }, [symbol]);

  return data;
};

export default useChartSocket;