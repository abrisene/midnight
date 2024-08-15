import { z } from "zod";

import { CoerceJSONSchema, JsonSchema } from "./json-schema-zod";

describe("CoerceJSONSchema", () => {
  it("should parse valid JSON", () => {
    const input = '{"name": "John", "age": 30}';
    const result = CoerceJSONSchema.parse(input);
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should parse valid JSON5", () => {
    const input = '{name: "John", age: 30}';
    const result = CoerceJSONSchema.parse(input);
    expect(result).toEqual({ name: "John", age: 30 });
  });

  it("should heal broken JSON", () => {
    const input = '{"name": "John", "age":';
    const result = CoerceJSONSchema.parse(input);
    expect(result).toEqual({ name: "John" });
  });

  it("should handle arrays", () => {
    const input = "[1, 2, 3,]";
    const result = CoerceJSONSchema.parse(input);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should handle nested objects and arrays", () => {
    const input = '{"items": [1, 2, {"nested": true}]}';
    const result = CoerceJSONSchema.parse(input);
    expect(result).toEqual({ items: [1, 2, { nested: true }] });
  });

  it("should throw an error for invalid input", () => {
    const input = "not a json";
    expect(() => CoerceJSONSchema.parse(input)).toThrow();
  });
});

describe("JsonSchema", () => {
  it("should validate literal values", () => {
    expect(JsonSchema.parse("string")).toBe("string");
    expect(JsonSchema.parse(42)).toBe(42);
    expect(JsonSchema.parse(true)).toBe(true);
    expect(JsonSchema.parse(null)).toBe(null);
  });

  it("should validate arrays", () => {
    const input = [1, "two", true, null];
    expect(JsonSchema.parse(input)).toEqual(input);
  });

  it("should validate objects", () => {
    const input = { a: 1, b: "two", c: true, d: null };
    expect(JsonSchema.parse(input)).toEqual(input);
  });

  it("should validate nested structures", () => {
    const input = {
      array: [1, { nested: "object" }],
      object: { nestedArray: [true, null] },
    };
    expect(JsonSchema.parse(input)).toEqual(input);
  });

  it("should throw an error for invalid input", () => {
    expect(() => JsonSchema.parse(undefined)).toThrow();
    expect(() => JsonSchema.parse(() => {})).toThrow();
  });
});
