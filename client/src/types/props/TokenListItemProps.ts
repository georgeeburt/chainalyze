import Token from "../api/Token";
import Metadata from "../api/Metadata";

export default interface TokenListItemProps {
  key: number;
  token: Token;
  metadata: Metadata;
  rank: number;
  priceData: {
    price: number;
    marketCap: number;
    volume: number;
  };
}