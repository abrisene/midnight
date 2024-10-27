import { z } from "zod";

import { Json } from "./json";

describe("Json", () => {
  describe("parse", () => {
    it("should parse valid JSON", () => {
      const input = '{"name": "John", "age": 30}';
      const expected = { name: "John", age: 30 };
      expect(Json.parse(input)).toEqual(expected);
    });

    it("should parse partial JSON when partial option is true", () => {
      const input = '{"name": "John", "age":';
      const expected = { name: "John" };
      expect(Json.parse(input, undefined, { partial: true })).toEqual(expected);
    });

    it("should parse JSON5 when json5 option is true", () => {
      const input = '{name: "John", age: 30}';
      const expected = { name: "John", age: 30 };
      expect(Json.parse(input, undefined, { json5: true })).toEqual(expected);
    });
  });

  describe("parseSchema", () => {
    it("should parse and validate JSON using a Zod schema", () => {
      const input = '{"name": "John", "age": 30}';
      const schema = z.object({ name: z.string(), age: z.number() });
      expect(Json.parseValidated(input, schema)).toEqual({
        name: "John",
        age: 30,
      });
    });

    it("should throw an error when validation fails", () => {
      const input = '{"name": "John", "age": "30"}';
      const schema = z.object({ name: z.string(), age: z.number() });
      expect(() => Json.parseValidated(input, schema)).toThrow();
    });
  });

  describe("stringify", () => {
    it("should stringify an object to JSON beautifully", () => {
      const input = { name: "John", age: 30 };
      const expected = '{ "name": "John", "age": 30 }';
      expect(Json.stringify(input)).toBe(expected);
    });

    it("should respect the space parameter", () => {
      const input = { name: "John", age: 30 };
      const expected = '{\n    "name": "John",\n    "age": 30\n}';
      expect(Json.stringify(input, null, 4, 1)).toBe(expected);
    });

    it("should respect the limit parameter", () => {
      const input = {
        name: "John",
        age: 30,
      };
      const result = Json.stringify(input, null, 2, 500);
      expect(result.match(/\n/g)?.length).toBeUndefined();
    });
  });
});
