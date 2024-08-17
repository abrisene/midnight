/* -------------------------------------------------------------------------------------------------
 * ARRAY UTILS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Merges arrays and removes duplicates.
 * @param arrays The arrays to merge.
 * @returns A new array with the merged and deduped values.
 */
export function mergeArraysUnique<T>(...arrays: T[][]) {
  const merged = ([] as T[]).concat(...arrays);
  return [...new Set(merged)];
}

/**
 * Coerces a value to an array.
 * @param value The value to coerce - if an array is passed, it is returned as is.
 * @returns The coerced array
 */
export function coerceArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * Filters an array for nullish values.
 * @param array The array to filter.
 * @returns The filtered array.
 */
export function filterNullish<T>(array: T[]): NonNullable<T>[] {
  return array.filter(
    (item): item is NonNullable<T> => item !== null && item !== undefined,
  );
}

/**
 * Chunks an array into smaller arrays of a specified size.
 * @param array The array to chunk.
 * @param size The size of each chunk.
 * @returns An array of chunks.
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, index) =>
    array.slice(index * size, (index + 1) * size),
  );
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param array The array to shuffle.
 * @returns The shuffled array.
 */
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j] as T;
    array[j] = temp as T;
  }
  return array;
}

/**
 * Returns the last n elements of an array.
 * @param array The input array.
 * @param n The number of elements to return.
 * @returns The last n elements of the array.
 */
export function lastN<T>(array: T[], n: number): T[] {
  return array.slice(Math.max(array.length - n, 0));
}

/**
 * Flattens a nested array structure.
 * @param arr The array to flatten.
 * @returns A flattened array.
 */
export function flattenDeep<T>(arr: (T | T[])[]): T[] {
  return arr.reduce<T[]>(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat([val]),
    [],
  );
}
