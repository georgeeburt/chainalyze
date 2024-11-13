import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PriceData } from '../../types/sockets/PriceData';
import PortfolioToken from '../../types/api/Portfolio';

interface BarChartProps {
  userPortfolio: PortfolioToken['holdings'];
  prices: Record<string, PriceData>;
}

const BarPortfolioChart: React.FC<BarChartProps> = ({ userPortfolio, prices }) => {
  const chartData = userPortfolio
    .map(holding => {
      const priceInfo = prices[holding.token.symbol + 'USDT'] || prices[holding.token.symbol];
      const value = priceInfo?.price ? holding.quantity * priceInfo.price : 0;

      return {
        name: holding.token.symbol,
        value: value
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const formatYAxis = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="flex flex-col gap-10 bg-lightnav dark:bg-darkbtn border-2 dark:border-darkborder rounded-lg p-8">
      <h2 className="text-5xl font-semibold">Holdings Value</h2>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 40, bottom: 30 }}
          >
            <XAxis
              dataKey="name"
              tick={{ fill: 'currentColor' }}
              axisLine={{ stroke: '#666' }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fill: 'currentColor' }}
              axisLine={{ stroke: '#666' }}
            />
            <Tooltip
              formatter={(value: number) => [
                `$${value.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}`,
                'Value'
              ]}
            />
            <Bar
              dataKey="value"
              fill="#8C52FF"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarPortfolioChart;