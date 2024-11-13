import React, { useMemo } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import type DonutPortfolioChartProps from '../../types/props/DonutChartPortfolioProps';

const COLORS = ['#8C52FF', '#B14BFF', '#D452FF', '#FF52E9', '#FF52B1', '#A364FF'];

const getColor = (index: number) => {
  return COLORS[index % COLORS.length];
};

const DonutPortfolioChart: React.FC<DonutPortfolioChartProps> = ({ userPortfolio, tokens, prices }) => {
  const chartData = useMemo(() => {
    const totalPortfolioValue = userPortfolio.reduce((total, holding) => {
      const token = tokens[holding.token.symbol];
      const price = prices[token?.symbol + 'USDT']?.price || prices[token?.symbol]?.price || 0;
      return total + (holding.quantity * price);
    }, 0);

    if (totalPortfolioValue === 0) return [];

    return userPortfolio
      .map((holding, index) => {
        const token = tokens[holding.token.symbol];
        const price = prices[token?.symbol + 'USDT']?.price || prices[token?.symbol]?.price || 0;
        const value = (holding.quantity * price) / totalPortfolioValue * 100;

        return {
          name: token?.symbol || '',
          value,
          key: `${token?.symbol || ''}-${index}`,
        };
      })
      .filter(item => item.value > 0);
  }, [userPortfolio, tokens, prices]);

  if (!chartData.length) {
    return null;
  }

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
          isAnimationActive={false}
          label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}
          labelLine={false}
        >
          {chartData.map(({ key }, index) => (
            <Cell key={key} fill={getColor(index)} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => `${value.toFixed(1)}%`}
          labelFormatter={(name: string) => name}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default DonutPortfolioChart;
