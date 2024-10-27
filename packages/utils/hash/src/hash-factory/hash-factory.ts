import { createMD5, createXXHash32 } from "hash-wasm";

/* -------------------------------------------------------------------------------------------------
 * FACTORIES
 * -----------------------------------------------------------------------------------------------*/

/**
 * Creates a hasher for the XXHash32 algorithm.
 * @returns The hasher.
 */

/**
 * Creates a hasher for the XXHash32 algorithm.
 * @param seed The seed for the hasher.
 * @returns The hasher - a function that takes a data object and returns a hash.
 */
export async function createXXHasher(
  seed: number,
): Promise<(data: unknown) => string> {
  const xxHash = await createXXHash32(seed);
  const xxHasher = (data: unknown): string => {
    return xxHash.init().update(JSON.stringify(data)).digest("hex");
  };
  return xxHasher;
}
/**
 * Creates a hasher for the MD5 algorithm.
 * @returns The hasher.
 */

export async function createMD5Hasher(): Promise<(data: unknown) => string> {
  const md5Hasher = await createMD5();
  return (data: unknown): string =>
    md5Hasher.init().update(JSON.stringify(data)).digest("hex");
}
