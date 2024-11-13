export const abbreviateCurrency = (value: number): string => {
  if (value >= 1e12) {
    // Trillions
    return '$' + (value / 1e12).toFixed(2) + 'T';
  } else if (value >= 1e9) {
    // Billions
    return '$' + (value / 1e9).toFixed(2) + 'B';
  } else if (value >= 1e6) {
    // Millions
    return '$' + (value / 1e6).toFixed(2) + 'M';
  } else {
    return '$' + value.toString();
  }
};