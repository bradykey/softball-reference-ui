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
 * Constant value that defines the colors used in the theme.
 */
export const THEME_COLORS = {
  primary: ' '
};
