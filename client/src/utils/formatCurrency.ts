export const formatCurrency = (value: number): string => {
  const subscriptDigits: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
  };

  // Format the currency with sufficient decimal places
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);

  // Check if the number is small
  if (value < 0.1) {
    // Separate main part and last digit
    const mainPart = formattedValue.slice(0, -1);
    const lastDigit = formattedValue.slice(-1);

    const subscriptedLastDigit = subscriptDigits[lastDigit] || lastDigit;

    return mainPart + subscriptedLastDigit;
  }
  return formattedValue;
};