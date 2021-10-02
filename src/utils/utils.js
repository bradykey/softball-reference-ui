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

/**
 * By default, columns that are sorted using the built in "click-on-header"
 * functionality of the v-data-table sort ascending first, and then
 * descending. Since we want the numbered stats to sort descending first (so
 * we see who has the highest PAs, BA, etc.) we have to handle the override
 * of the sortDesc property.
 *
 * NOTE: We need to have must-sort turned on for the table otherwise,
 * sometimes the payload of this event is an array of size one, and
 * sometimes it's a string. Weird. must-sort keeps the "reset" functionality
 * turned off. That is, it either is sorting ascending or descending of the
 * column you clicked. In other words, there are two toggleable options, not
 * three (the third being none sort).
 *
 * @param {String} nameOfColumnToSortBy this is the column that was selected
 * to sort by in the table
 */
export function customInitialSortDirection(nameOfColumnToSortBy, headers) {
  let headerToSortBy = headers.find(h => h.value === nameOfColumnToSortBy);

  return (
    !isObjectUndefinedEmptyOrNull(headerToSortBy) &&
    headerToSortBy.sortDescFirst
  );
}

/**
 * Determines if the scores designate a win.
 * @param {int} score
 * @param {int} opponentScore
 * @returns true if the score is greater than the opponent's score, false
 * otherwise.
 */
export function didWin(score, opponentScore) {
  return score > opponentScore;
}
