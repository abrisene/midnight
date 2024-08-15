import { isDeepEqualData } from "./is-deep-equal-data";

describe("isDeepEqualData", () => {
  it("should return true for identical primitive values", () => {
    expect(isDeepEqualData(1, 1)).toBe(true);
    expect(isDeepEqualData("hello", "hello")).toBe(true);
    expect(isDeepEqualData(true, true)).toBe(true);
    expect(isDeepEqualData(null, null)).toBe(true);
    expect(isDeepEqualData(undefined, undefined)).toBe(true);
  });

  it("should return false for different primitive values", () => {
    expect(isDeepEqualData(1, 2)).toBe(false);
    expect(isDeepEqualData("hello", "world")).toBe(false);
    expect(isDeepEqualData(true, false)).toBe(false);
    expect(isDeepEqualData(null, undefined)).toBe(false);
  });

  it("should compare Date objects correctly", () => {
    const date1 = new Date("2023-01-01");
    const date2 = new Date("2023-01-01");
    const date3 = new Date("2023-01-02");
    expect(isDeepEqualData(date1, date2)).toBe(true);
    expect(isDeepEqualData(date1, date3)).toBe(false);
  });

  it("should compare arrays correctly", () => {
    expect(isDeepEqualData([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(isDeepEqualData([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(isDeepEqualData([1, 2, 3], [1, 2, 3, 4])).toBe(false);
  });

  it("should compare nested objects correctly", () => {
    const obj1 = { a: 1, b: { c: 2, d: [3, 4] } };
    const obj2 = { a: 1, b: { c: 2, d: [3, 4] } };
    const obj3 = { a: 1, b: { c: 2, d: [3, 5] } };
    expect(isDeepEqualData(obj1, obj2)).toBe(true);
    expect(isDeepEqualData(obj1, obj3)).toBe(false);
  });

  it("should handle objects with different key orders", () => {
    const obj1 = { a: 1, b: 2 };
    const obj2 = { b: 2, a: 1 };
    expect(isDeepEqualData(obj1, obj2)).toBe(true);
  });
});
