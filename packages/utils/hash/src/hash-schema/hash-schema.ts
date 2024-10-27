import { HASHER_XXHASH } from "../hashers/hashers";
import type { Awaitable } from "./shared-types";

/* -------------------------------------------------------------------------------------------------
 * SCHEMA HASHING
 * -----------------------------------------------------------------------------------------------*/

/**
 * Hashes a schema.
 * @param hasher A function that takes a string and returns a string
 * @param properties A schema to hash
 * @returns A string
 */
export async function hashSchemaWithHasher(
  hasher: Awaitable<(input: string) => string> = HASHER_XXHASH,
  properties: Record<string, any>,
): Promise<string> {
  // Get the hasher
  const hashFn = await hasher;

  // Get the property entries
  const propertyEntries = Object.entries(properties).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  // Get the property hashes
  const propertyHashes = await Promise.allSettled(
    propertyEntries.map(async ([key, value]) => {
      // If the value is an object, recurse
      const valueHash =
        typeof value === "object"
          ? await hashSchemaWithHasher(hasher, value)
          : hashFn(value ?? "undefined");
      return `${key}:${valueHash}`;
    }),
  );

  // Return the hash
  return hashFn(
    propertyHashes
      .map((p) => (p.status === "fulfilled" ? p.value : ""))
      .join("|"),
  );
}
