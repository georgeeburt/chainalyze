export default interface Token {
  id: number;
  name: string;
  symbol: string;
  quote: {
    USD: {
      price: number;
      market_cap: number;
      volume_24h: number;
      volume_change_24h: number,
      percent_change_1h: number,
      percent_change_24h: number,
      percent_change_7d: number,
      percent_change_30d: number,
    };
  };
  circulating_supply: number;
}
