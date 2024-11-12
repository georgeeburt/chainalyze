import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import DonutPortfolioChartProps from '../../types/props/DonutChartPortfolioProps';
import PortfolioToken from '../../types/api/Portfolio';

// Function to generate a unique color for each token
const getColor = (index: number) => {
  const hue = (index * 15) % 360; // Golden angle increment
  return `hsl(${hue}, 100%, 80%)`;
}

const DonutPortfolioChart: React.FC<DonutPortfolioChartProps> = ({ userPortfolio, tokens, prices }) => {
  const [chartData, setChartData] = useState<
    { name: string; value: number; key: string }[]
  >([]);
  const prevUserPortfolioRef = useRef<PortfolioToken['holdings']>([]);

  useEffect(() => {
    // Calculate the total portfolio value
    const totalPortfolioValue = userPortfolio.reduce((total, holding) => {
      const token = tokens[holding.token.symbol];
      const price = prices[token?.symbol + 'USDT']?.price || prices[token?.symbol]?.price || 0;
      return total + (holding.quantity * price);
    }, 0);

    // Map the data to chart-friendly format with percentages
    const newChartData = userPortfolio.map((holding, index) => {
      const token = tokens[holding.token.symbol];
      const price = prices[token?.symbol + 'USDT']?.price || prices[token?.symbol]?.price || 0;
      const value = (holding.quantity * price) / totalPortfolioValue * 100;
      return {
        name: token?.symbol || '',
        value,
        key: `${token?.symbol || ''}-${index}`,
      };
    });

    setChartData(newChartData);

    // Store the previous userPortfolio for comparison
    prevUserPortfolioRef.current = userPortfolio;
  }, [userPortfolio, tokens, prices]);

  useEffect(() => {
    // Check if the userPortfolio has changed
    const prevUserPortfolio = prevUserPortfolioRef.current;
    if (prevUserPortfolio.length !== userPortfolio.length) {
      // Animate the changes
      setChartData(() => {
        const newChartData = userPortfolio.map((holding, index) => {
          const token = tokens[holding.token.symbol];
          const price = prices[token?.symbol + 'USDT']?.price || prices[token?.symbol]?.price || 0;
          const value = (holding.quantity * price) / prevUserPortfolio.reduce((total, h) => {
            const t = tokens[h.token.symbol];
            const p = prices[t?.symbol + 'USDT']?.price || prices[t?.symbol]?.price || 0;
            return total + (h.quantity * p);
          }, 0) * 100;
          return {
            name: token?.symbol || '',
            value,
            key: `${token?.symbol || ''}-${index}`,
          };
        });
        return newChartData;
      });
    }
  }, [userPortfolio, tokens, prices]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          fill="#8884d8"
          label={({ name, value }) => `${name} (${value.toFixed(2)}%)`}
          animationDuration={500} // Adjust the animation duration as needed
          animationEasing="ease-out"
        >
          {chartData.map(({ key }) => (
            <Cell key={key} fill={getColor(chartData.findIndex(item => item.key === key))} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${value.toFixed(2)}%`}
          labelFormatter={(name: string) => name}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutPortfolioChart;