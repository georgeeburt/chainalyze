// Function to format price change percentage with a plus sign for positive changes
export const formatPriceChange = (value: number) => {
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);

  return value > 0 ? `+${formattedValue}` : formattedValue;
};