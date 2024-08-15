import type { z, ZodType } from "zod";

/* -------------------------------------------------------------------------------------------------
 * FETCHER
 *
 * This is a utility function that provides a simple way to fetch data from a server
 * and validate the response using zod.
 * -----------------------------------------------------------------------------------------------*/

/**
 * A fetcher factory function that uses the provided base URL and default options.
 * The fetcher automatically parses the response as JSON and validates it
 * using a provided zod schema.
 * @param baseURL The base URL to use for the fetcher.
 * @param defaultOptions The default request options to use for the fetcher.
 * @param callback The callback to run after a successful fetch.
 * @returns A fetcher function.
 */
export const fetcher = (
  baseURL: URL | string,
  defaultOptions: RequestInit = {},
  callback?: () => void,
) => {
  return async <V extends ZodType>(
    route: string,
    options: RequestInit = {},
    validator: V,
  ): Promise<z.infer<V>> => {
    const url = new URL(route, baseURL);

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    const res = await fetch(url, config);
    if (!res.ok) throw new Error("Invalid response.");
    if (callback) callback();
    const data = await res.json();
    return validator.parse(data);
  };
};
