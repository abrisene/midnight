/*
 * random.ts
 * Random Number Generator
 */

import { z } from "zod";

import { MersenneTwister } from "../mersenne-twister";
import { SeedRNG } from "../seed/random-seed";
import { RNG_PREWARM } from "./random-constants";

/**
 * Module Dependencies
 */

/**
 * Types
 */

export type RandomDTO = z.infer<typeof RandomDTO>;
export const RandomDTO = z.object({
  seed: SeedRNG.optional(),
  uses: z.number().optional(),
});

/**
 * Class
 */

export class Random {
  protected _seed: SeedRNG;
  protected _engine: MersenneTwister;

  constructor(config: RandomDTO) {
    this._seed = config.seed !== undefined ? config.seed : Date.now();
    this._engine = new MersenneTwister(this._seed, config.uses ?? RNG_PREWARM);
  }

  get seed() {
    return this._seed;
  }

  get uses() {
    return this._engine.uses;
  }

  /**
   * Generates a random integer between a min and a max value.
   * @param min The min value
   * @param max The max value
   * @returns A random integer between min and max.
   */
  public integer(min: number, max: number): number {
    return Math.floor(Math.abs(this._engine.random()) * (max - min + 1)) + min;
  }

  /**
   * Generates a random real number between a min and a max value.
   * @param min The min value
   * @param max The max value
   * @returns A random real number between min and max.
   */
  public real(min: number, max: number): number {
    return this._engine.random() * (max - min) + min;
  }

  /**
   * Generates a random boolean value based on the given percentage.
   * @param percentage The percentage of true values.
   * @returns A random boolean value.
   */
  public bool(percentage = 0.5): boolean {
    return this._engine.random() < percentage;
  }

  /**
   * Picks a random element from the provided array.
   * @param source The source array.
   * @param begin The begin index.
   * @param end The end index.
   * @returns A random element from the provided array.
   */
  public pick<T>(source: ArrayLike<T>, begin = 0, end = source.length): T {
    const index = this.integer(begin, end - 1);
    return source[index]!;
  }

  /**
   * Picks a weighted key from a normalized object, ignoring masked values.
   * @param object An object containing normalized number values.
   * @param mask Array of keys to be ignored while evaluating.
   */
  public pickWeighted(
    object: { [key: string]: number },
    mask?: string[],
  ): string | undefined {
    const value = this.real(0, 1);
    let lastValid: string | undefined = undefined;
    let result: string | undefined = undefined;
    let sum = 0;

    Object.keys(object).some((key) => {
      if (!mask || !mask.includes(key)) {
        sum += object[key]!;
        if (sum >= value) {
          result = key;
          return true;
        }
        lastValid = key;
      }
      return false;
    });

    return result || lastValid;
  }

  /**
   * Clones the current Random instance with the specified use count.
   * @param useCount The use count.
   * @returns A new Random instance with the specified use count.
   */
  public clone(useCount?: number): Random {
    return new Random({ seed: this._seed, uses: useCount || this.uses });
  }

  /**
   * Serializes the current Random instance to a DTO.
   * @returns A DTO with the seed and use count.
   */
  public serialize(): RandomDTO {
    return {
      seed: this._seed,
      uses: this.uses,
    };
  }

  /**
   * Serializes the current Random instance to a DTO.
   * @returns A DTO with the seed and use count.
   */
  toJSON = () => this.serialize();

  /**
   * Creates a new Random instance with the given seed and use count.
   * @param seed The seed.
   * @param uses The use count.
   * @returns A new Random instance with the given seed and use count.
   */
  public static new(seed?: SeedRNG, uses?: number): Random {
    return new Random({ seed, uses });
  }
}
