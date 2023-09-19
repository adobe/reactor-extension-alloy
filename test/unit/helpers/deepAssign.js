const isNil = value => value == null;
const isObject = value =>
  !isNil(value) && !Array.isArray(value) && typeof value === "object";

const deepAssignObject = (target, source) => {
  Object.keys(source).forEach(key => {
    if (isObject(target[key]) && isObject(source[key])) {
      deepAssignObject(target[key], source[key]);
      return;
    }

    target[key] = source[key];
  });
};

/**
 * Recursively copy the values of all enumerable own properties from a source item to a target item if the both items are objects
 * @param {Object} target - a target object
 * @param {...Object} source - an array of source objects
 * @example
 * deepAssign({ a: 'a', b: 'b' }, { b: 'B', c: 'c' });
 * // { a: 'a', b: 'B', c: 'c' }
 */
export default (target, ...sources) => {
  if (isNil(target)) {
    throw new TypeError('deepAssign "target" cannot be null or undefined');
  }

  const result = Object(target);

  sources.forEach(source => deepAssignObject(result, Object(source)));

  return result;
};
