/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  const arrCopy = [...arr];

  switch (param) {
  case 'asc' :
    return arrCopy.sort((a, b) => {
      if (a !== b && a.toLowerCase() === b.toLowerCase()) {
        return -a.localeCompare(b);
      }
      return a.localeCompare(b);
    });

  case 'desc' :
    return arrCopy.sort((a, b) => {
      if (a !== b && a.toLowerCase() === b.toLowerCase()) {
        return a.localeCompare(b);
      }
      return -a.localeCompare(b);
    });

  default:
    return arrCopy;
  }
}
