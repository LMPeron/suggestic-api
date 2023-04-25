module.exports = class ItemUtils {
  /**
   Recursively flattens a nested array of items into a single flattened array.
   @param {Array} items The nested array to flatten.
   @returns {Array} The flattened array.
*/
  static flattenItems(items) {
    if (!Array.isArray(items)) return [];
    let result = [];
    for (const item of items) {
      if (Array.isArray(item)) result.push(...this.flattenItems(item));
      else if (typeof item === "object" && item !== null)
        result.push(...this.flattenItems(Object.values(item)));
      else result.push(item);
    }
    return result;
  }
};
