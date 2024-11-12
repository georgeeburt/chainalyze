import { PriceData } from "../sockets/PriceData";
import PortfolioToken from "../api/Portfolio";
import Token from "../api/Token";

export default interface DonutPortfolioChartProps {
  userPortfolio: PortfolioToken['holdings'];
  tokens: Record<string, Token>;
  prices: Record<string, PriceData>;
}