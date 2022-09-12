/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const sortFn = (x, y) => {
    return x.localeCompare(y, ['ru', 'kf'], {caseFirst: 'upper'});
  };

  return [...arr].sort((a, b) => {
    switch (param) {
    case 'asc' :
      return sortFn(a, b);

    case 'desc' :
      return sortFn(b, a);

    default:
      throw new Error('Unacceptable param value');
    }
  });
}
