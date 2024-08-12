import { z } from "zod";

export type InitKeyArray = z.infer<typeof InitKeyArray>;
export const InitKeyArray = z.array(z.coerce.number());

export type SeedRNG = z.infer<typeof SeedRNG>;
export const SeedRNG = z.union([z.coerce.number(), InitKeyArray]);

export const DefaultSeedSchema = z.coerce.number().default(() => Date.now());

/**
 * Generates a random seed.
 * @param seed - The seed to use - if not provided, the current time is used.
 * @returns The seed as a number.
 */
export function randomSeed(seed?: SeedRNG): SeedRNG {
  return DefaultSeedSchema.parse(seed);
}
