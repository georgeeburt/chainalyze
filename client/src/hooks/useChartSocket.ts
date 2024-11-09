import { useState, useEffect } from "react";
import ChartData from "../types/sockets/ChartData";

const useChartSocket = (symbol: string) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (!symbol) return;

    const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase() + 'usdt'}@kline_1s`);

    socket.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
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