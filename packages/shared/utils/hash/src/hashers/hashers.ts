import { z } from "zod";

import { createMD5Hasher, createXXHasher } from "../hash-factory/hash-factory";
import { createSchemaHasher } from "../hash-schema/schema-hasher-factory";

/* -------------------------------------------------------------------------------------------------
 * UTILS
 * -----------------------------------------------------------------------------------------------*/

/**
 * Get the default seed for the hashers.
 * @returns The seed.
 */
function getDefaultSeed() {
  const pSeed = process.env.GLOBAL_SEED;
  if (pSeed) {
    const parsed = z.coerce.number().safeParse(pSeed);
    if (parsed.success) {
      return parsed.data;
    }
  }

  // Must be a 32-bit number
  return Date.now() % 0x100000000;
}

/* -------------------------------------------------------------------------------------------------
 * MONADS
 * -----------------------------------------------------------------------------------------------*/

const DEFAULT_SEED = getDefaultSeed();

export const HASHER_XXHASH = createXXHasher(DEFAULT_SEED);
export const HASHER_MD5 = createMD5Hasher();

/**
 * Hashes a schema.
 * @param properties A schema to hash
 * @returns A string
 */
export const SCHEMA_HASHER = createSchemaHasher(HASHER_XXHASH);
