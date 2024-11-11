export const formatMarketCap = (value: number): string => {
  // Format the currency with sufficient decimal places
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);

  return formattedValue;
};