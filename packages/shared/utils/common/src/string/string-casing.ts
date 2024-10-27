/* -------------------------------------------------------------------------------------------------
 * Title Case
 * -----------------------------------------------------------------------------------------------*/

/**
 * Converts a standard string to Title Case.
 * @param str The string to convert.
 * @returns The title cased string.
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

/* -------------------------------------------------------------------------------------------------
 * Camel / Snake Case
 * -----------------------------------------------------------------------------------------------*/

/**
 * Converts a standard string to camel case.
 * @param str The string to convert.
 * @returns The camel cased string.
 */

export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
}

/**
 * Converts a camelCased string to Title Case.
 * @param str The string to convert.
 * @returns The title cased string.
 */
export function camelToTitleCase(str: string): string {
  const result = str.replace(/([A-Z])/g, (match, group: string) => ` ${group}`);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

/**
 * Converts a camel cased string to snake case.
 * @param str The string to convert.
 * @returns The snake cased string.
 */
export function camelToSnakeCase(str: string) {
  return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

/**
 *  Checks if a string is camel cased.
 * @param str The string to check.
 * @returns Whether the string is camel cased.
 */
export function isCamelCase(str: string) {
  return str.match(/^([a-z]+)(([A-Z]([a-z]+))+)$/g) !== null;
}

/**
 *  Checks if a string is snake cased.
 * @param str The string to check.
 * @returns Whether the string is snake cased.
 */
export function isSnakeCase(str: string) {
  // If the string has no underscores...
  if (str.match(/_/g) === null) {
    // ...and the string has spaces, it's not snake case.
    if (str.match(/\s/g) !== null) return false;

    // ...if it's all lowercase then it's snake case.
    return str.match(/^[a-z]+$/g) !== null;
  } else {
    return /^[a-z]+(_[a-z]+)*$/.test(str);
  }
}

/**
 * Converts a snake cased string to camel case.
 * @param str The string to convert.
 * @returns The camel cased string.
 */
export function snakeToCamelCase(str: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  return str.replace(/_([a-z])/g, (_, match) => match.toUpperCase());
}

/**
 * Checks if a string is snake cased.
 * @param str The string to check.
 * @returns Whether the string is snake cased.
 */
// export function isSnakeCase(str: string) {
//   // If the string has no underscores, but there's only one word, it's snake case.
//   if (str.match(/_/g) === null) return str.match(/\s/g) === null;
// }
