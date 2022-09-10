/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];

  const sortFn = (arr) => {
    return arr.sort((a, b) => a.localeCompare(b, ['ru', 'kf'], {caseFirst: 'upper'}));
  };

  switch (param) {
  case 'asc' :
    return sortFn(arrCopy);

  case 'desc' :
    return sortFn(arrCopy).reverse();

  default:
    return arrCopy;
  }
}
