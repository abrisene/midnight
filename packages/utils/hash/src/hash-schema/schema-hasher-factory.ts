import { hashSchemaWithHasher } from "./hash-schema";
import { Awaitable } from "./shared-types";

/* -------------------------------------------------------------------------------------------------
 * FACTORIES
 * -----------------------------------------------------------------------------------------------*/

/**
 * Creates a schema hasher.
 * @param hasher A function that takes a string and returns a string
 * @returns A function that takes a schema and returns a hash
 */
export function createSchemaHasher(
  hasher: Awaitable<(input: string) => string>,
) {
  return (properties: Record<string, any>) =>
    hashSchemaWithHasher(hasher, properties);
}
