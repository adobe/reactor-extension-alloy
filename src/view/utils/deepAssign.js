/**
 * Assign a value to a property path on an object without modifying nearby
 * properties. Modifies the target object.
 *
 * @param {{ [key: string]: * }} target The destination object for the value
 * @param {string} path The property path to set. A string of period-separated keys
 * @param {*} value
 * @returns {void}
 * @example
 * const obj = {};
 * deepAssign(obj, "a.b.c", 1);
 * console.log(obj); // { a: { b: { c: 1 } } }
 */
export function deepAssign(target, path, value) {
  const [key, ...rest] = path.split(".");
  if (rest.length === 0) {
    target[key] = value;
  } else {
    if (!target[key]) {
      target[key] = {};
    }
    deepAssign(target[key], rest.join("."), value);
  }
}
