const indicators = ['', 'K', 'M', 'B', 'T'];

export default (number: number, suffix?: string, pluralSuffix?: string): string => {
  suffix = number !== 1 && pluralSuffix ? pluralSuffix : suffix || '';

  if (number < 1000) return `${number} ${suffix}`.trim();
  let i = 0;
  while (i < indicators.length - 1 && number >= 1000) {
    if (number < 1000) break;
    number = number / 1000;
    i++;
  }
  return `${number.toFixed(2)}${indicators[i]} ${suffix}`.trim();
};
