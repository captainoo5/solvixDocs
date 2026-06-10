import writtenNumber from 'written-number';

export const amountToWords = (amount) => {
  if (!amount || amount === 0) return 'Zero Naira Only.';
  const n = Math.floor(amount);
  const words = writtenNumber(n, { lang: 'en' });
  const formattedWords = words.charAt(0).toUpperCase() + words.slice(1);
  return `${formattedWords.replace(/-/g, ' ')} Naira Only.`;
};
