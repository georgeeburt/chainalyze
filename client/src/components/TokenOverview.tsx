import { useState, useEffect, useRef, MutableRefObject } from "react";
import { useParams } from "react-router-dom";
import { createChart, IChartApi, ISeriesApi, LineData, Time } from "lightweight-charts";
import useChartSocket from "../hooks/useChartSocket";
import Metadata from "../types/api/Metadata";
import websiteButton from '../assets/website.svg';
import whitePaperButton from '../assets/whitepaper.svg';
import { KlineData } from "../types/api/KlineData";

const TokenOverview = () => {
  const { id } = useParams();
  const [tokenMetadata, setTokenMetadata] = useState<Metadata | null>(null);
  const [historicalData, setHistoricalData] = useState<LineData[]>([]);
  const [symbol, setSymbol] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<IChartApi | null>(null) as MutableRefObject<IChartApi | null>;
  const seriesRef = useRef<ISeriesApi<"Line">>(null) as MutableRefObject<ISeriesApi<"Line"> | null>;

  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const socketData = useChartSocket(symbol);

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!id) return;

      // Fetch appropriate token metadata
      const response = await fetch (`http://localhost:3001/api/metadata?id=${id}`);
      const responseData = await response.json();
      const metadata = responseData?.data?.[id];
      setSymbol(metadata?.symbol?.toLowerCase());
      setLoading(false);
      setTokenMetadata(metadata);
    };
    fetchTokenData();
  }, [id]);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (!symbol) return;
      const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}USDT&interval=1s&limit=500`);
      const data: KlineData[] = await response.json();
      const chartData = data.map((item) => ({
        time: Math.floor(item[0] / 1000) as Time,
        value: parseFloat(item[4]),
      }));
      setHistoricalData(chartData);
    };
    fetchHistoricalData();
  }, [symbol]);

  useEffect(() => {
    if (!tokenMetadata || !chartContainerRef.current) return;
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 450,
      timeScale: {
        timeVisible: true,
        secondsVisible: true
      }
    });

    const series = chart.addLineSeries({
      color: 'rgb(140, 82, 255)',
      lineWidth: 2
    });

    chartRef.current = chart;
    seriesRef.current = series;

    if (historicalData.length > 0) {
      series.setData(historicalData);
    }

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, [historicalData]);

  // Create chart when token metadata is available
  useEffect(() => {
    if (!seriesRef.current || !socketData.length) return;

    const latestData = socketData[socketData.length - 1];
    const chartData: LineData = {
      time: Math.floor(latestData.k.t / 1000) as Time,
      value: parseFloat(latestData.k.c),
    };
    // Update the chart with the new data
    seriesRef.current.update(chartData);
  }, [socketData]);

  return (
    <div className="flex flex-col gap-4 text-3xl font-semibold px-[15%] py-[2%] h-full">
      {loading ? (
        <div className="w-full h-40 bg-lightnav animate-pulse rounded-md" />
      ) :
      <div className="flex flex-col bg-lightnav dark:bg-darklabel py-[3%] px-[2%]">
        <div className="flex items-center gap-3">
          <img src={tokenMetadata?.logo} alt={`${tokenMetadata?.name} logo`} className="w-12" />
          <h1 className="">{tokenMetadata?.name} <span className="font-thin">{tokenMetadata?.symbol}</span></h1>
        </div>
        <a href={tokenMetadata?.urls?.website[0]} target="_blank" className="inline">
          <img src={websiteButton} alt={`${tokenMetadata?.name} website`} />
        </a>
        <a href={tokenMetadata?.urls?.technical_doc[0]} target="_blank" className="inline">
          <img src={whitePaperButton} alt={`${tokenMetadata?.name} whitepaper`} />
        </a>
      </div>}

      <div ref={chartContainerRef} className="chart-container"></div>
      <div
        ref={chartContainerRef}
        className={`chart-container ${loading ? 'bg-gradient-to-r from-gradient-start via-gradient-middle to-gradient-end animate-loading' : ''}`}
      ></div>
    </div>
  );
};

export default TokenOverview;