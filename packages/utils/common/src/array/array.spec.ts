import {
  chunkArray,
  coerceArray,
  filterNullish,
  flattenDeep,
  lastN,
  mergeArraysUnique,
  shuffleArray,
} from "./array";

describe("Array Utilities", () => {
  describe("mergeArraysUnique", () => {
    it("should merge arrays and remove duplicates", () => {
      const result = mergeArraysUnique([1, 2, 3], [3, 4, 5], [5, 6, 1]);
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe("coerceArray", () => {
    it("should return the same array if an array is passed", () => {
      const arr = [1, 2, 3];
      expect(coerceArray(arr)).toBe(arr);
    });

    it("should wrap a non-array value in an array", () => {
      expect(coerceArray(42)).toEqual([42]);
    });
  });

  describe("filterNullish", () => {
    it("should remove null and undefined values from an array", () => {
      const input = [1, null, 2, undefined, 3];
      const result = filterNullish(input);
      expect(result).toEqual([1, 2, 3]);
      expect(result.length).toEqual(3);
    });
  });

  describe("chunkArray", () => {
    it("should split an array into chunks of the specified size", () => {
      const input = [1, 2, 3, 4, 5, 6, 7];
      expect(chunkArray(input, 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    });
  });

  describe("shuffleArray", () => {
    it("should shuffle the array in place", () => {
      const input = [1, 2, 3, 4, 5];
      const shuffled = shuffleArray([...input]);
      expect(shuffled).not.toEqual(input);
      expect(shuffled.sort()).toEqual(input);
    });
  });

  describe("lastN", () => {
    it("should return the last n elements of an array", () => {
      const input = [1, 2, 3, 4, 5];
      expect(lastN(input, 3)).toEqual([3, 4, 5]);
    });

    it("should return the whole array if n is greater than array length", () => {
      const input = [1, 2, 3];
      expect(lastN(input, 5)).toEqual([1, 2, 3]);
    });
  });

  describe("flattenDeep", () => {
    it("should flatten a deeply nested array", () => {
      const input = [1, [2, [3, [4]], 5]];
      expect(flattenDeep(input)).toEqual([1, 2, 3, 4, 5]);
    });

    it("should return the same array if it's already flat", () => {
      const input = [1, 2, 3, 4, 5];
      expect(flattenDeep(input)).toEqual(input);
    });
  });
});
