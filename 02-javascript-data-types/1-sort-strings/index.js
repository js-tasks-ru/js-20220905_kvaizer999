/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  return [...arr].sort((a, b) => {
    switch (param) {
    case 'asc' :
      return a.localeCompare(b, ['ru', 'kf'], {caseFirst: 'upper'});

    case 'desc' :
      return b.localeCompare(a, ['ru', 'kf'], {caseFirst: 'upper'});

    default:
      throw new Error('Unacceptable param value');
    }
  });
}
