import { useEffect, useRef, MutableRefObject } from "react";
import { createChart, IChartApi, ISeriesApi, AreaData, Time } from "lightweight-charts";
import ChartProps from "../../types/props/ChartProps";

const Chart = ({ historicalData, socketData }: ChartProps) => {
  const chartRef = useRef<IChartApi | null>(null) as MutableRefObject<IChartApi | null>;
  const seriesRef = useRef<ISeriesApi<"Area">>(null) as MutableRefObject<ISeriesApi<"Area"> | null>;
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  const lightTheme = {
    layout: { backgroundColor: '#FFFFFF', textColor: '#000' },
    grid: { vertLines: { color: '#e1e1e1' }, horzLines: { color: '#e1e1e1' } },
  };

  const darkTheme = {
    layout: { backgroundColor: '#3F3F3F', textColor: '#FFFFFF' },
    grid: { vertLines: { color: '#333333' }, horzLines: { color: '#333333' } },
  };

  const setChartTheme = (isDarkMode: boolean) => {
    if (chartRef.current) {
      chartRef.current.applyOptions({
        layout: {
          background: { color: isDarkMode ? darkTheme.layout.backgroundColor : lightTheme.layout.backgroundColor },
          textColor: isDarkMode ? darkTheme.layout.textColor : lightTheme.layout.textColor,
        },
        grid: isDarkMode ? darkTheme.grid : lightTheme.grid,
      });
    }
  };

  // Create chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 450,
      ...lightTheme,
      timeScale: { timeVisible: true, secondsVisible: true }
    });

    const series = chart.addAreaSeries({
      topColor: 'rgba(140, 82, 255, 0.4)',
      bottomColor: 'rgba(140, 82, 255, 0.1)',
      lineColor: 'rgba(140, 82, 255, 1)',
      lineWidth: 2
    });

    chartRef.current = chart;
    seriesRef.current = series;

    // Immediately set the correct chart theme on page load
    const isDarkMode = document.documentElement.classList.contains('dark');
    setChartTheme(isDarkMode);

    if (historicalData.length > 0) {
      series.setData(historicalData);
    }

    // Resize chart on window resize
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize(chartContainerRef.current?.clientWidth ?? 0, 450);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      window.removeEventListener('resize', handleResize);
    };
  }, [historicalData]);

  // Watch for dark mode toggle
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setChartTheme(isDarkMode);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Update chart with websocket data
  useEffect(() => {
    if (!seriesRef.current || !socketData.length) return;

    const latestData = socketData[socketData.length - 1];
    const chartData: AreaData = {
      time: Math.floor(latestData.k.t / 1000) as Time,
      value: parseFloat(latestData.k.c),
    };
    seriesRef.current.update(chartData);
  }, [socketData]);

  return <div ref={chartContainerRef} className="chart-container" />;
};

export default Chart;