import type { InitKeyArray, SeedRNG } from "../seed/random-seed";

/**
 * A Mersenne Twister class for generating seeded random numbers.
 * Adapted from https://gist.github.com/thiloplanz/6abf04f957197e9e3912
 */

export class MersenneTwister {
  private readonly N = 624;
  private readonly M = 397;
  private readonly MATRIX_A = 0x9908b0df; // constant vector a
  private readonly UPPER_MASK = 0x80000000; // most significant w-r bits
  private readonly LOWER_MASK = 0x7fffffff; // least significant r bits

  private _mt: number[] = [this.N];
  private _mti: number = this.N + 1;

  private _uses = 0; // The number of times the rng has been used.
  private _seed: SeedRNG;

  constructor(seed?: SeedRNG, uses?: number) {
    this._seed = seed ?? new Date().getTime();
    // this._uses = uses ?? 0;
    this.init(seed, uses);
  }

  get seed() {
    return this._seed;
  }

  set seed(value: SeedRNG) {
    this.init(value);
  }

  get uses() {
    return this._uses;
  }

  set uses(value: number) {
    // Throw an error if an invalid value is provided.
    if (value < 0)
      throw new Error(
        "Could not set uses on Mersenne Twister - negative values are not allowed.",
      );

    const diff = value - this._uses;
    if (diff > 0) {
      // If > 0, discard to get to the use count.
      this.discard(diff);
    } else {
      // Otherwise we need to re-initialize.
      this.init(this._seed, value);
    }
  }

  /**
   * Initializes the MT and gets to the specified use count.
   * @param uses
   */
  private init(seed?: SeedRNG, uses?: number) {
    // Update the Seed if applicable.
    this._seed = seed ?? this._seed;

    // Initialize the Seed
    if (Array.isArray(this._seed)) {
      this.initByArray(this._seed, this._seed.length);
    } else {
      this.initSeed(this._seed);
    }

    // Reset the use count.
    this._uses = 0;
    if (uses) {
      this.discard(uses);
    }
  }

  /**
   * Initializes the generator with a seed
   * @param s The seed
   */
  private initSeed(s: number): void {
    this._mt[0] = s >>> 0;
    for (this._mti = 1; this._mti < this.N; this._mti++) {
      const s = this._mt[this._mti - 1]! ^ (this._mt[this._mti - 1]! >>> 30);
      this._mt[this._mti] =
        ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
        (s & 0x0000ffff) * 1812433253 +
        this._mti;
      this._mt[this._mti]! >>>= 0; // for >32 bit machines
    }
  }

  /**
   * Initializes the generator with an array of seeds
   * @param initKey The array of seeds
   * @param keyLength The length of the array of seeds
   */
  private initByArray(initKey: InitKeyArray, keyLength: number): void {
    let i = 1;
    let j = 0;
    let k = this.N > keyLength ? this.N : keyLength;
    this.initSeed(19650218);

    for (; k; k--) {
      const s = this._mt[i - 1]! ^ (this._mt[i - 1]! >>> 30);
      this._mt[i] =
        (this._mt[i]! ^
          (((((s & 0xffff0000) >>> 16) * 1664525) << 16) +
            (s & 0x0000ffff) * 1664525)) +
        initKey[j]! +
        j;
      this._mt[i]! >>>= 0;
      i++;
      j++;
      if (i >= this.N) {
        this._mt[0] = this._mt[this.N - 1]!;
        i = 1;
      }
      if (j >= keyLength) j = 0;
    }

    for (k = this.N - 1; k; k--) {
      const s = this._mt[i - 1]! ^ (this._mt[i - 1]! >>> 30);
      this._mt[i] =
        (this._mt[i]! ^
          (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) +
            (s & 0x0000ffff) * 1566083941)) -
        i;
      this._mt[i]! >>>= 0;
      i++;
      if (i >= this.N) {
        this._mt[0] = this._mt[this.N - 1]!;
        i = 1;
      }
    }

    this._mt[0] = 0x80000000; // MSB is 1; assuring non-zero initial array
  }

  /**
   * Generates the next set of numbers
   */
  private generateInt32(): number {
    let y: number;
    const mag01 = [0x0, this.MATRIX_A];

    if (this._mti >= this.N) {
      let kk: number;

      if (this._mti === this.N + 1) {
        this.initSeed(5489); // Default seed
      }

      for (kk = 0; kk < this.N - this.M; kk++) {
        y =
          (this._mt[kk]! & this.UPPER_MASK) |
          (this._mt[kk + 1]! & this.LOWER_MASK);
        this._mt[kk] = this._mt[kk + this.M]! ^ (y >>> 1) ^ mag01[y & 0x1]!;
      }
      for (; kk < this.N - 1; kk++) {
        y =
          (this._mt[kk]! & this.UPPER_MASK) |
          (this._mt[kk + 1]! & this.LOWER_MASK);
        this._mt[kk] =
          this._mt[kk + (this.M - this.N)]! ^ (y >>> 1) ^ mag01[y & 0x1]!;
      }
      y =
        (this._mt[this.N - 1]! & this.UPPER_MASK) |
        (this._mt[0]! & this.LOWER_MASK);
      this._mt[this.N - 1] =
        this._mt[this.M - 1]! ^ (y >>> 1) ^ mag01[y & 0x1]!;

      this._mti = 0;
    }

    y = this._mt[this._mti++]!;

    /* Tempering */
    y ^= y >>> 11;
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= y >>> 18;

    this._mt[this._mti - 1] = y;
    this._uses += 1;

    return y >>> 0;
  }

  /**
   * Discards a number of generations.
   * @param count The number of generations to discard. Defaults to 1.
   */
  public discard(count = 1) {
    if (count <= 0) return;
    for (let i = 0; i < count; i += 1) {
      this.generateInt32();
    }
    return;
  }

  /**
   * @returns A random integer between 0 and 2^31 - 1
   */
  public randomInt(): number {
    return this.randomInt31();
  }

  /**
   * @returns A random integer between 0 and 2^31 - 1
   */
  public randomInt31(): number {
    return this.generateInt32() >>> 1;
  }

  /* generates a random number on [0,1)-real-interval */
  random() {
    return this.randomIncl();
  }

  /* generates a random number on [0,1)-real-interval */
  randomIncl() {
    /* divided by 2^32 */
    return this.generateInt32() * (1.0 / 4294967296.0);
  }

  /* generates a random number on (0,1)-real-interval */
  randomExcl() {
    /* divided by 2^32 */
    return (this.generateInt32() + 0.5) * (1.0 / 4294967296.0);
  }

  /* generates a random number on [0,1) with 53-bit resolution*/
  randomLong() {
    var a = this.generateInt32() >>> 5,
      b = this.generateInt32() >>> 6;
    return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
  }
}
