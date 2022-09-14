/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0 || !string) {
    return '';
  }

  if (!size) {
    return string;
  }

  let counter = 1;
  let letter = string[0];
  let result = string[0];

  for (let i = 1; i < string.length; i++) {
    if (letter === string[i] && counter < size) {
      result += string[i];
      counter++;
    }

    if (letter !== string[i]) {
      letter = string[i];
      result += string[i];
      counter = 1;
    }
  }
  return result;
}
