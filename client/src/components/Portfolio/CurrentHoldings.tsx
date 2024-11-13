// components/portfolio/CurrentHoldings.tsx
import HoldingCard from './HoldingCard';
import type { Metadata } from '../../types/api/Metadata';
import type { PriceData } from '../../types/sockets/PriceData';
import type PortfolioToken from '../../types/api/Portfolio';

interface CurrentHoldingsProps {
  holdings: PortfolioToken['holdings'];
  tokenMetadata: { [key: string]: Metadata };
  prices: Record<string, PriceData>;
  onDeleteToken: (tokenName: string) => void;
}

const CurrentHoldings = ({
  holdings,
  tokenMetadata,
  prices,
  onDeleteToken
}: CurrentHoldingsProps) => {
  return (
    <div className="flex flex-col gap-4 bg-lightnav dark:bg-darkbtn border-2 dark:border-darkborder rounded-lg w-10/12 p-6">
      <h2 className="text-4xl font-semibold">Current Holdings</h2>
      <div className="flex flex-wrap gap-3">
        {!holdings.length ? (
          <p className="text-xl">No current token holdings.</p>
        ) : (
          holdings.map((holding, index) => {
            const matchingMetadata = Object.values(tokenMetadata).find(
              meta => meta.symbol === holding.token.symbol
            );
            const priceInfo =
              prices[holding.token.symbol + 'USDT'] ||
              prices[holding.token.symbol];
            const totalValue = priceInfo?.price
              ? holding.quantity * priceInfo.price
              : 0;

            return (
              <HoldingCard
                key={index}
                holding={holding}
                metadata={matchingMetadata}
                priceInfo={priceInfo}
                totalValue={totalValue}
                onDelete={onDeleteToken}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CurrentHoldings;
