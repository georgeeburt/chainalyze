import Token from "../api/Token";
import Metadata from "../api/Metadata";
import { PriceData } from "../sockets/PriceData";

export default interface TokenListItemProps {
  key: number;
  token: Token;
  metadata: Metadata;
  rank: number;
  priceData: PriceData;
}