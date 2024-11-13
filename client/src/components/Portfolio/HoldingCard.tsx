// components/portfolio/HoldingCard.tsx
import { Metadata } from '../../types/api/Metadata';
import { PriceData } from '../../types/sockets/PriceData';
import { formatPriceChange } from '../../utils/formatters/formatPriceChange';
import PortfolioToken from '../../types/api/Portfolio';

interface HoldingCardProps {
  holding: PortfolioToken['holdings'][0];
  metadata: Metadata | undefined;
  priceInfo: PriceData;
  totalValue: number;
  onDelete: (tokenName: string) => void;
}

const HoldingCard = ({
  holding,
  metadata,
  priceInfo,
  totalValue,
  onDelete
}: HoldingCardProps) => {
  return (
    <div className="flex items-center bg-lightlisthov dark:bg-darkbtnhov border-2 border-gray-400 dark:border-darkborder gap-4 rounded-lg p-2">
      {metadata?.logo && (
        <img
          src={metadata.logo}
          alt={`${holding.token.name} logo`}
          className="w-6 h-6"
        />
      )}
      <p className="text-lg leading-tight">
        {holding.token.name} ({holding.token.symbol})
        <br />
        <span className="text-sm dark:text-stone">Quantity: </span>
        <span className="text-sm dark:text-white">
          {holding.quantity}
        </span>
        {priceInfo && typeof priceInfo.price === 'number' && (
          <>
            <br />
            <span className="text-sm dark:text-stone">Value: </span>
            <span className="text-sm dark:text-white">
              {'$' +
                totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
            </span>{' '}
            {typeof priceInfo.priceChange === 'number' && (
              <span
                className={
                  priceInfo.priceChange >= 0
                    ? 'text-forest text-sm'
                    : 'text-red text-sm'
                }
              >
                {formatPriceChange(priceInfo.priceChange)}
              </span>
            )}
          </>
        )}
      </p>
      <button
        onClick={() => onDelete(holding.token.name)}
        className="hover:text-red"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default HoldingCard;
