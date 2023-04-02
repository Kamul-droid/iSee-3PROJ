export function buildSortObject(str: string) {
  const sort = {};

  if (!str) return {};

  str.split(',').forEach((sortElem) => {
    const sortElemSplit = sortElem.split(':');

    // Assume ascending order if no order is given
    if (sortElemSplit.length === 1) {
      sortElemSplit.push('asc');
    }

    if (['desc', '-1'].includes(sortElemSplit[1])) {
      sort[sortElemSplit[0]] = -1;
    } else {
      sort[sortElemSplit[0]] = 1;
    }
  });

  return sort;
}
