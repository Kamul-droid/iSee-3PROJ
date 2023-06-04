export default (date: string, locale: string, withTime?: boolean) => {
  const _date = new Date(date);

  let str = _date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (withTime) {
    str += ' ' + _date.toLocaleTimeString(locale, {});
  }

  return str;
};
