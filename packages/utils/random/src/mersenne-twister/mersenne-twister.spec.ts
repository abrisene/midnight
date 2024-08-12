import { MersenneTwister } from "./mersenne-twister";

describe("MersenneTwister", () => {
  it("should initialize with a numeric seed", () => {
    const mt = new MersenneTwister(12345);
    expect(mt.seed).toBe(12345);
    expect(mt.uses).toBe(0);
  });

  it("should initialize with an array seed", () => {
    const seed = [1, 2, 3, 4, 5];
    const mt = new MersenneTwister(seed);
    expect(mt.seed).toEqual(seed);
    expect(mt.uses).toBe(0);
  });

  it("should generate consistent random numbers for the same seed", () => {
    const mt1 = new MersenneTwister(12345);
    const mt2 = new MersenneTwister(12345);

    for (let i = 0; i < 1000; i++) {
      expect(mt1.random()).toBe(mt2.random());
    }
  });

  it("should generate different sequences for different seeds", () => {
    const mt1 = new MersenneTwister(12345);
    const mt2 = new MersenneTwister(54321);

    let allSame = true;
    for (let i = 0; i < 1000; i++) {
      if (mt1.random() !== mt2.random()) {
        allSame = false;
        break;
      }
    }
    expect(allSame).toBe(false);
  });

  it("should correctly update uses count", () => {
    const mt = new MersenneTwister(12345);
    expect(mt.uses).toBe(0);

    mt.random();
    expect(mt.uses).toBe(1);

    for (let i = 0; i < 999; i++) {
      mt.random();
    }
    expect(mt.uses).toBe(1000);
  });

  it("should discard generations correctly", () => {
    const mt1 = new MersenneTwister(12345);
    const mt2 = new MersenneTwister(12345);

    mt1.discard(1000);
    expect(mt1.uses).toBe(1000);

    for (let i = 0; i < 1000; i++) {
      mt2.random();
    }

    // After discarding, mt1 should generate the same numbers as mt2
    for (let i = 0; i < 1000; i++) {
      expect(mt1.random()).toBe(mt2.random());
    }
  });

  it("should generate numbers within expected ranges", () => {
    const mt = new MersenneTwister(12345);

    for (let i = 0; i < 1000; i++) {
      expect(mt.random()).toBeGreaterThanOrEqual(0);
      expect(mt.random()).toBeLessThan(1);

      expect(mt.randomInt()).toBeGreaterThanOrEqual(0);
      expect(mt.randomInt()).toBeLessThan(2 ** 32);

      expect(mt.randomInt31()).toBeGreaterThanOrEqual(0);
      expect(mt.randomInt31()).toBeLessThan(2 ** 31);

      expect(mt.randomIncl()).toBeGreaterThanOrEqual(-1);
      expect(mt.randomIncl()).toBeLessThanOrEqual(1);

      expect(mt.randomLong()).toBeGreaterThanOrEqual(0);
      expect(mt.randomLong()).toBeLessThan(9223372036854776000);
    }
  });

  it("should throw an error when setting negative uses", () => {
    const mt = new MersenneTwister(12345);
    expect(() => {
      mt.uses = -1;
    }).toThrow(
      "Could not set uses on Mersenne Twister - negative values are not allowed.",
    );
  });

  it("should reset to initial state when setting uses to 0", () => {
    const mt = new MersenneTwister(12345);
    const initialSequence = Array.from({ length: 1000 }, () => mt.random());

    mt.uses = 500;
    mt.uses = 0;

    const resetSequence = Array.from({ length: 1000 }, () => mt.random());
    expect(resetSequence).toEqual(initialSequence);
  });
});
