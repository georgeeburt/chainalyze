export const formatPrice = (value: number): string => {
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

  // Set decimal places based on value threshold
  const fractionDigits = value > 100 ? 2 : 4;

  // Format the currency with specified decimal places
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: fractionDigits,
  }).format(value);

  // Check if the number is very small and needs subscript formatting
  if (value < 0.1) {
    const mainPart = formattedValue.slice(0, -1);
    const lastDigit = formattedValue.slice(-1);

    const subscriptedLastDigit = subscriptDigits[lastDigit] || lastDigit;

    return mainPart + subscriptedLastDigit;
  }

  return formattedValue;
};