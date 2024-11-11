import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaData, Time } from 'lightweight-charts';
import Chart from './Chart';
import useChartSocket from '../../hooks/useChartSocket';
import Metadata from '../../types/api/Metadata';
import { KlineData } from '../../types/api/KlineData';
import Token from '../../types/api/Token';
import { formatPriceChange } from '../../utils/formatPriceChange';

const TokenOverview = () => {
  const { id } = useParams();
  const [tokenMetadata, setTokenMetadata] = useState<Metadata | null>(null);
  const [tokenData, setTokenData] = useState<Token | null>(null);
  const [historicalData, setHistoricalData] = useState<AreaData[]>([]);
  const [symbol, setSymbol] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const socketData = useChartSocket(symbol);

  const baseUrl = 'http://localhost:3001/api/';

  // Fetch appropriate token metadata
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!id) return;

      const response = await fetch(`${baseUrl}metadata?id=${id}`);
      const responseData = await response.json();
      const metadata = responseData?.data?.[id];
      if (metadata?.symbol) {
        setSymbol(metadata?.symbol.toLowerCase());
      }
      setTokenMetadata(metadata);
    };
    fetchTokenData();
  }, [id]);

  // Fetch token data only after `symbol` is set
  useEffect(() => {
    if (!symbol) return;
    const fetchTokenData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}tokens?symbol=${symbol.toUpperCase()}`
        );
        if (!response.ok) throw new Error('Failed to fetch token data');
        const tokenInfo = await response.json();
        setTokenData(tokenInfo.data[symbol.toUpperCase()]);
      } catch (error) {
        console.error('Error fetching token data for token overview:', error);
      }
    };
    fetchTokenData();
  }, [symbol]);

  // Fetch historical chart data only after `symbol` is set
  useEffect(() => {
    if (!symbol) return;
    const fetchHistoricalData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=1s&limit=1000`
        );
        const data: KlineData[] = await response.json();
        const chartData = data.map(item => ({
          time: Math.floor(item[0] / 1000) as Time,
          value: parseFloat(item[4])
        }));
        setHistoricalData(chartData);
      } catch (error) {
        console.error('Error fetching historical chart data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoricalData();
  }, [symbol]);

  if (loading || !tokenMetadata || !tokenData) {
    return (
      <div className="flex justify-center items-center h-screen transform -translate-y-6">
        <div className="w-12 h-12 border-4 border-elixir border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 text-3xl font-normal px-[15%] py-[2%] h-full">
      <div className="flex flex-col gap-10 bg-lightnav dark:bg-darklabel rounded-md py-[2%] px-[2%]">
        <div className="flex justify-start items-center gap-3">
          <img
            src={tokenMetadata.logo}
            alt={`${tokenMetadata.name} logo`}
            className="w-12"
          />
          <h1 className="font-semibold">
            {tokenMetadata?.name}{' '}
            <span className="font-thin text-gunmetal dark:text-stone">
              {tokenMetadata.symbol}
            </span>
          </h1>
        </div>
        <div className="flex flex-wrap text-center gap-6 text-black text-lg">
          <div className="bg-lilac rounded-lg p-4">
            <h2 className="font-semibold">Price</h2>
            <p>{tokenData.quote.USD.price}</p>
          </div>
          <div className="bg-lilac rounded-lg p-4">
            <h2 className="font-semibold">Volume (24hr)</h2>
            <p>{tokenData.quote.USD.volume_24h}</p>
          </div>
          <div className="bg-lilac rounded-lg p-4">
            <h2 className="font-semibold">Market Cap</h2>
            <p>{tokenData.quote.USD.market_cap}</p>
          </div>
          <div className="bg-lilac rounded-lg p-4">
            <h2 className="font-semibold">Circulating Supply</h2>
            <p>
              {tokenData.circulating_supply}{' '}
              <span className="text-darklabel">{tokenMetadata.symbol}</span>
            </p>
          </div>
          <div className="flex flex-col flex-end flex-grow bg-lightlisthov dark:bg-darkbtnhov text-start text-black dark:text-stone rounded-lg p-4">
            <h2 className="font-semibold dark:text-white">Price Change %</h2>
            <p>
              1h:{' '}
              <span
                className={
                  tokenData.quote.USD.percent_change_1h < 0
                    ? 'text-red'
                    : 'text-forest'
                }
              >
                {formatPriceChange(tokenData.quote.USD.percent_change_1h)}
              </span>
            </p>
            <p>
              24h:{' '}
              <span
                className={
                  tokenData.quote.USD.percent_change_24h < 0
                    ? 'text-red'
                    : 'text-forest'
                }
              >
                {formatPriceChange(tokenData.quote.USD.percent_change_24h)}
              </span>
            </p>
            <p>
              7d:{' '}
              <span
                className={
                  tokenData.quote.USD.percent_change_7d < 0
                    ? 'text-red'
                    : 'text-forest'
                }
              >
                {formatPriceChange(tokenData.quote.USD.percent_change_7d)}
              </span>
            </p>
            <p>
              30d:{' '}
              <span
                className={
                  tokenData.quote.USD.percent_change_30d < 0
                    ? 'text-red'
                    : 'text-forest'
                }
              >
                {formatPriceChange(tokenData.quote.USD.percent_change_30d)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <Chart historicalData={historicalData} socketData={socketData} />
    </div>
  );
};

export default TokenOverview;
