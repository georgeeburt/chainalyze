import TokenListItemProps from '../../types/props/TokenListItemProps';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatPriceChange } from '../../utils/formatPriceChange';

const TokenListItem = ({
  token,
  metadata,
  rank,
  priceData
}: TokenListItemProps) => {
  return (
    <tr key={token.id} className="border-b bg-slate dark:bg-darklabel">
      <td className="font-light text-gunmetal dark:text-stone rounded-l-lg p-4">
        {rank}
      </td>
      <td className="flex gap-3 p-4">
        <img
          src={metadata?.logo}
          alt={`${token.name} logo`}
          className="w-6 h-6 mr-2"
        />
        <div>
          {token.name}{' '}
          <span className="font-light text-gunmetal dark:text-stone">
            {token.symbol}
          </span>
        </div>
      </td>
      <td>
        {priceData?.price < 1
          ? formatCurrency(priceData?.price)
          : formatCurrency(priceData?.price)}
      </td>
      <td>{formatCurrency(priceData?.marketCap)}</td>
      <td
        className={`rounded-r-lg ${
          priceData.priceChange < 0 ? 'text-red' : 'text-forest'
        }`}
      >
        {formatPriceChange(priceData.priceChange)}
      </td>
    </tr>
  );
};

export default TokenListItem;
