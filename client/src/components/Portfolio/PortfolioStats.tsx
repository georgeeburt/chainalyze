import StatItem from './StatItem';
import { formatPrice } from '../../utils/formatters/formatPrice';

interface PortfolioStatsProps {
  totalValue: number;
  valueChange: { amount: number; percentage: number };
  topEarner: string | null;
}

const PortfolioStats = ({ totalValue, valueChange, topEarner }: PortfolioStatsProps) => (
  <div className="flex flex-col gap-6 bg-lightlisthov dark:bg-darklabel border-2 border-gray-300 dark:border-darkborder rounded-lg p-8">
    <h3 className="text-4xl font-semibold">Portfolio Statistics</h3>
    <div className="flex flex-col gap-3">
      <StatItem
        icon="dollar"
        label="Total Value"
        value={formatPrice(totalValue)}
        change={valueChange.percentage}
      />
      <StatItem
        icon="chart"
        label="Value Change (24hr)"
        value={formatPrice(valueChange.amount)}
        isNegative={valueChange.amount < 0}
      />
      <StatItem
        icon="trophy"
        label="Top Earner (24hr)"
        value={topEarner || 'N/A'}
      />
    </div>
  </div>
);

export default PortfolioStats;
