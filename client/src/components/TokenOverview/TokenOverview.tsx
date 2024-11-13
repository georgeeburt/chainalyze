import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AreaData, Time } from 'lightweight-charts';
import Chart from './Chart';
import useChartSocket from '../../hooks/useChartSocket';
import useMetadata from '../../hooks/useMetadata';
import { Metadata } from '../../types/api/Metadata';
import { KlineData } from '../../types/api/KlineData';
import Token from '../../types/api/Token';
import { formatPriceChange } from '../../utils/formatters/formatPriceChange';
import { formatPrice } from '../../utils/formatters/formatPrice';
import { abbreviateCurrency } from '../../utils/numberAbbreviators/abbreviateCurrency';
import { abbreviateNumber } from '../../utils/numberAbbreviators/abbreviateNumber';

const TokenOverview = () => {
  const { id } = useParams();
  const { getMetadata } = useMetadata();
  const [tokenMetadata, setTokenMetadata] = useState<Metadata | null>(null);
  const [tokenData, setTokenData] = useState<Token | null>(null);
  const [historicalChartData, setHistoricalChartData] = useState<AreaData[]>([]);
  const [symbol, setSymbol] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const socketData = useChartSocket(symbol);
  const latestData = socketData[socketData.length - 1]?.k;
  const liveData = latestData
    ? {
        price: parseFloat(latestData.c),
        marketCap:
          parseFloat(latestData.c) * (tokenData?.circulating_supply || 0)
      }
    : null;

  const baseUrl = 'http://localhost:3001/api/';

  useEffect(() => {
    const loadMetadata = async () => {
      if (!id) return;

      try {
        const metadata = await getMetadata(id);
        if (metadata) {
          setTokenMetadata(metadata);
          if (metadata.symbol) {
            setSymbol(metadata.symbol.toLowerCase());
          }
        }
      } catch (error) {
        console.error('Error loading metadata:', error);
        setTokenMetadata(null);
      }
    };

    loadMetadata();
  }, [id, getMetadata]);

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
    const dataRefresh = setInterval(fetchTokenData, 60000);

    return () => clearInterval(dataRefresh);
  }, [symbol]);

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
        setHistoricalChartData(chartData);
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
    <div className="flex flex-col gap-2 text-3xl font-normal px-[15%] py-[0.5%] h-full">
      <div className="flex flex-col gap-3 bg-lightnav dark:bg-darklabel border-2 border-gray-200 dark:border-darkborder rounded-md py-[1%] px-[2%]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          <div className="flex gap-2 text-black dark:text-white">
            <button
              onClick={() =>
                window.open(tokenMetadata.urls.website[0], '_blank')
              }
              className="flex items-center gap-2 text-[1.5rem] text-black dark:text-white bg-lightlisthov dark:bg-darkbtnhov rounded-lg border-2 border-gray-300 dark:border-darkborder hover:bg-violet hover:dark:bg-elixir p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                />
              </svg>
              Website
            </button>
            <button
              onClick={() =>
                window.open(tokenMetadata.urls.technical_doc[0], '_blank')
              }
              className="flex items-center gap-2 text-[1.5rem] text-black dark:text-white bg-lightlisthov dark:bg-darkbtnhov rounded-lg border-2 border-gray-300 dark:border-darkborder hover:bg-violet hover:dark:bg-elixir p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z"
                />
              </svg>
              Whitepaper
            </button>
          </div>
        </div>
        <div className="flex">
          {/* Left part (purple sections) */}
          <div className="grid grid-cols-2 gap-3 text-black text-center text-xl flex-grow">
            <div className="bg-violet dark:bg-elixir border-2 border-purple-300 dark:border-purple-900 rounded-lg p-4">
              <h2 className="font-semibold">Price</h2>
              <p className="font-light">
                {formatPrice(liveData?.price ?? tokenData.quote.USD.price)}
              </p>
            </div>
            <div className="bg-violet dark:bg-elixir rounded-lg p-4">
              <h2 className="font-semibold">Market Cap</h2>
              <p className="font-light">
                {liveData?.price && tokenData?.circulating_supply
                  ? abbreviateCurrency(
                      liveData.price * tokenData.circulating_supply
                    )
                  : 'Loading...'}
              </p>
            </div>
            <div className="bg-violet dark:bg-elixir border-2 border-purple-300 dark:border-purple-900 rounded-lg p-4">
              <h2 className="font-semibold">Volume (24hr)</h2>
              <p className="font-light">
                {abbreviateCurrency(tokenData.quote.USD.volume_24h)}
              </p>
            </div>
            <div className="bg-violet dark:bg-elixir border-2 border-purple-300 dark:border-purple-900 rounded-lg p-4">
              <h2 className="font-semibold">Volume Change % (24hr)</h2>
              <p className='font-light'>{formatPriceChange(tokenData.quote.USD.volume_change_24h)}</p>
            </div>
            <div className="bg-violet dark:bg-elixir border-2 border-purple-300 dark:border-purple-900 rounded-lg p-4">
              {' '}
              <h2 className="font-semibold">Circulating Supply</h2>{' '}
              <p className="font-light">
                {' '}
                {abbreviateNumber(tokenData.circulating_supply)}{' '}
                <span className="text-darknavhov font-semibold">
                  {tokenMetadata.symbol}
                </span>{' '}
              </p>{' '}
            </div>{' '}
            <div className="bg-violet dark:bg-elixir border-2 border-purple-300 dark:border-purple-900 rounded-lg p-4">
              {' '}
              <h2 className="font-semibold">Max. Supply</h2>{' '}
              <p className='font-light'>
                {' '}
                {tokenData.max_supply
                  ? abbreviateNumber(tokenData.max_supply)
                  : '∞'}{' '}
                <span className="text-darknavhov font-semibold">
                  {tokenMetadata.symbol}
                </span>{' '}
              </p>{' '}
            </div>
          </div>

          {/* Price Change % section on the right */}
          <div className="flex flex-col gap- w-[25%] bg-lightlisthov dark:bg-darkbtnhov text-start text-[1.6rem] text-black dark:text-stone border-2 border-gray-300 dark:border-darkborder rounded-lg p-4 ml-10">
            <h2 className="font-semibold dark:text-white">Price Change %</h2>
            <p>
              1h:{' '}
              <span
                className={
                  tokenData.quote.USD.percent_change_1h < 0
                    ? 'text-red font-light'
                    : 'text-forest font-light'
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
                    ? 'text-red font-light'
                    : 'text-forest font-light'
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
                    ? 'text-red font-light'
                    : 'text-forest font-light'
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
                    ? 'text-red font-light'
                    : 'text-forest font-light'
                }
              >
                {formatPriceChange(tokenData.quote.USD.percent_change_30d)}
              </span>
            </p>
          </div>
        </div>
      </div>
      <Chart
        historicalData={historicalChartData}
        socketData={socketData}
        symbol={tokenMetadata.symbol}
      />
    </div>
  );
};

export default TokenOverview;
