/**
 * A nice little helper method that checks to see if an object is undefined, empty, or null.
 * @param {Object} someObject
 * @returns true if the object is undefined, empty, or null; galse otherwise
 */
export function isObjectUndefinedEmptyOrNull(someObject) {
  // The "truthy" value of null and undefined is FALSE
  if (someObject) return !Object.keys(someObject).length;
  else return true;
}

/**
 * Replaces text that has hyphens in it with spaces.
 * @param {String} text
 * @returns a new string with spaces where the hyphens used to be.
 */
export function formatHypenSpacedWordsToSpaces(text) {
  return text.replace(/-/g, ' ');
}

/**
 * Flatten a multidimensional object
 *
 * For example:
 *   flattenObject({ a: 1, b: { c: 2 } })
 * Returns:
 *   { a: 1, c: 2}
 */
export function flattenObject(obj) {
  const flattened = {};

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // recurse and add result to flattened object
      Object.assign(flattened, flattenObject(obj[key]));
    } else {
      // just a property; add it to flatted object
      flattened[key] = obj[key];
    }
  });

  return flattened;
}
