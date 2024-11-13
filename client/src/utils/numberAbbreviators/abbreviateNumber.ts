export const abbreviateNumber = (value: number): string => {
  if (value >= 1e12) {
    // Trillions
    return (value / 1e12).toFixed(1) + 'T';
  } else if (value >= 1e9) {
    // Billions
    return (value / 1e9).toFixed(1) + 'B';
  } else if (value >= 1e6) {
    // Millions
    return (value / 1e6).toFixed(1) + 'M';
  } else {
    return value.toString();
  }
};