export default interface PortfolioToken {
  holdings: { token: { name: string; symbol: string }; quantity: number }[];
}