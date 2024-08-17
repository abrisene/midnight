/* -------------------------------------------------------------------------------------------------
 * TYPES
 * -----------------------------------------------------------------------------------------------*/

export interface PrettyNumberOptions {
  digits?: number;
  lookup?: { value: number; symbol: string }[];
}

/* -------------------------------------------------------------------------------------------------
 * CONSTANTS
 * -----------------------------------------------------------------------------------------------*/

/* const baseNumberLookup = [
  { value: 1, symbol: "" },
  { value: 1e3, symbol: "k" },
  { value: 1e6, symbol: "M" },
  { value: 1e9, symbol: "B" },
  { value: 1e12, symbol: "T" },
  { value: 1e15, symbol: "P" },
  { value: 1e18, symbol: "E" },
]; */

const defaultNumberLookup = [
  { value: 1, symbol: "" },
  { value: 1_000, symbol: "k" },
  { value: 1_000_000, symbol: "M" },
  { value: 1_000_000_000, symbol: "B" },
  { value: 1_000_000_000_000, symbol: "T" },
  { value: 1_000_000_000_000_000, symbol: "Q" },
];

/* -------------------------------------------------------------------------------------------------
 * UTILITIES
 * -----------------------------------------------------------------------------------------------*/

/**
 * Returns a pretty number, truncated to the specified number of digits and with a suffix symbol.
 * @param num The number to prettify.
 * @param options.digits The number of digits to truncate to.
 * @param options.lookup The number suffix lookup table.
 * @returns
 */
export function prettifyNumber(num: number, options?: PrettyNumberOptions) {
  // Get the absolute value of the number
  const absoluteNum = Math.abs(num);

  // Remove trailing zeros from the number
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const lookup = options?.lookup ?? defaultNumberLookup;

  // Find the largest lookup item that is less than the absolute number
  const item = lookup
    .slice()
    .reverse()
    .find((item) => absoluteNum >= item.value);

  // Get the sign of the number
  const sign = num < 0 ? "-" : "";

  // Scale the number by the largest lookup item
  const scaled = item ? absoluteNum / item.value : absoluteNum;
  const digits = options?.digits ?? 2;

  // Format the number
  let result = sign + scaled.toFixed(digits).replace(regexp, "");

  // Add the suffix symbol
  if (item) result += item.symbol;

  // Return the result
  return result;
}
