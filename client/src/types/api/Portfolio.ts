export default interface PortfolioToken {
  holdings: {
    token: string;
    quantity: number;
  }[];
}