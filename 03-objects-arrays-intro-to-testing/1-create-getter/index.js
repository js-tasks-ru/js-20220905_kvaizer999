/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArr = path.split('.');
  return function(obj) {
    let value = obj[pathArr[0]];
    for (let i = 1; i < pathArr.length; i++) {
      if (typeof value === 'object') {
        value = value[pathArr[i]];
      }
    }
    return value;
  };
}
