/* -------------------------------------------------------------------------------------------------
 * STRING UNION UTILS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Creates a union type of string literals with strings, but retains intellisense for the literals.
 * Union<string, 'foo' | 'bar'> => string | Omit<string, 'foo' | 'bar'>
 */
export type StringUnion<S = string, T extends string | number = string> =
  | T
  | Omit<S, T>;

/**
 * A union of strings and an empty object - should achieve the same thing as StringUnion, but with
 * better type inference and without number support.
 */
export type OpenUnion<T> = T | (string & {});
