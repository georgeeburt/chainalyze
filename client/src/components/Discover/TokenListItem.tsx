import TokenListItemProps from '../../types/props/TokenListItemProps';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import { formatPriceChange } from '../../utils/formatPriceChange';
import { formatMarketCap } from '../../utils/formatMarketCap';

const TokenListItem = ({
  token,
  metadata,
  rank,
  priceData
}: TokenListItemProps) => {
  return (
    <tr key={token.id} className="border-b bg-slate dark:bg-darklabel hover:bg-lightlisthov dark:hover:bg-darklisthov">
      <td className="font-light text-gunmetal dark:text-stone rounded-l-lg p-4">
        {rank}
      </td>
      <td className="flex gap-3 p-6">
        <img
          src={metadata?.logo}
          alt={`${token.name} logo`}
          className="w-6 h-6 mr-2"
        />
        <div className='text-xl'>
          {token.name}{' '}
          <span className="font-light text-gunmetal dark:text-stone">
            {token.symbol}
          </span>
        </div>
      </td>
      <td className='text-xl'>
        {priceData?.price < 1
          ? formatPrice(priceData?.price)
          : formatPrice(priceData?.price)}
      </td>
      <td className='text-xl'>{formatMarketCap(priceData?.marketCap)}</td>
      <td
        className={` ${priceData.priceChange < 0 ? 'text-red text-xl' : 'text-forest text-xl'}`}
      >
        {formatPriceChange(priceData.priceChange)}
      </td>
      <td className='rounded-r-lg pr-6'>
        <Link to={`/token/${token.id}`}>
          <button className='text-xl hover:bg-lilac hover:text-white border-2 border-elixir hover:drop-shadow-elixirmd rounded-lg p-3'>Analyze</button>
        </Link>
      </td>
    </tr>
  );
};

export default TokenListItem;
