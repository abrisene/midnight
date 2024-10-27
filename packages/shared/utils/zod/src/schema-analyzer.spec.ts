import { z } from "zod";

import { SchemaAnalyzer } from "./schema-analyzer";

describe("SchemaAnalyzer", () => {
  let analyzer: SchemaAnalyzer;

  beforeEach(() => {
    analyzer = new SchemaAnalyzer();
  });

  describe("Basic Type Analysis", () => {
    it("should analyze simple primitive types", () => {
      const samples = [
        { type: "primitive", value: "string" },
        { type: "primitive", value: 123 },
        { type: "primitive", value: true },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.type);
      const schema = schemas["primitive"];

      if (!schema) {
        throw new Error("Schema is undefined");
      }

      // Test string validation
      expect(
        schema.safeParse({ type: "primitive", value: "test" }).success,
      ).toBe(true);
      // Test number validation
      expect(schema.safeParse({ type: "primitive", value: 456 }).success).toBe(
        true,
      );
      // Test boolean validation
      expect(
        schema.safeParse({ type: "primitive", value: false }).success,
      ).toBe(true);
      // Test invalid type
      expect(schema.safeParse({ type: "primitive", value: {} }).success).toBe(
        false,
      );
    });

    it("should handle arrays", () => {
      const samples = [
        { type: "array", values: [1, 2, 3] },
        { type: "array", values: [4, 5, 6] },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.type);
      const schema = schemas["array"];

      if (!schema) {
        throw new Error("Schema is undefined");
      }

      expect(
        schema.safeParse({ type: "array", values: [7, 8, 9] }).success,
      ).toBe(true);
      expect(
        schema.safeParse({ type: "array", values: ["invalid"] }).success,
      ).toBe(false);
    });

    it("should handle nested objects", () => {
      const samples = [
        {
          type: "nested",
          data: { name: "John", age: 30, address: { city: "New York" } },
        },
        {
          type: "nested",
          data: { name: "Jane", age: 25, address: { city: "Boston" } },
        },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.type);
      const schema = schemas["nested"];

      if (!schema) {
        throw new Error("Schema is undefined");
      }

      expect(
        schema.safeParse({
          type: "nested",
          data: { name: "Bob", age: 35, address: { city: "Chicago" } },
        }).success,
      ).toBe(true);

      expect(
        schema.safeParse({
          type: "nested",
          data: { name: "Invalid", age: "35", address: { city: 123 } },
        }).success,
      ).toBe(false);
    });
  });

  describe("Optional Fields", () => {
    it("should mark fields as optional when they appear in less than 90% of samples", () => {
      const samples = [
        { type: "optional", required: "always", optional: "sometimes" },
        { type: "optional", required: "always" },
        { type: "optional", required: "always", optional: "present" },
        { type: "optional", required: "always" },
        { type: "optional", required: "always", optional: "here" },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.type);
      const schema = schemas["optional"];

      if (!schema) {
        throw new Error("Schema is undefined");
      }

      expect(
        schema.safeParse({ type: "optional", required: "always" }).success,
      ).toBe(true);
      expect(
        schema.safeParse({
          type: "optional",
          required: "always",
          optional: "value",
        }).success,
      ).toBe(true);
      expect(schema.safeParse({ type: "optional" }).success).toBe(false); // missing required field
    });
  });

  describe("Union Types", () => {
    it("should handle union types for fields with multiple possible types", () => {
      const samples = [
        { type: "union", value: "string" },
        { type: "union", value: 42 },
        { type: "union", value: true },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.type);
      const schema = schemas["union"];

      if (!schema) {
        throw new Error("Schema is undefined");
      }

      expect(schema.safeParse({ type: "union", value: "string" }).success).toBe(
        true,
      );
      expect(schema.safeParse({ type: "union", value: 100 }).success).toBe(
        true,
      );
      expect(schema.safeParse({ type: "union", value: false }).success).toBe(
        true,
      );
      expect(schema.safeParse({ type: "union", value: {} }).success).toBe(
        false,
      );
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty samples", () => {
      const schemas = analyzer.analyzeSchema([], (s) => s.type);
      expect(schemas).toEqual({});
    });

    it("should handle null values", () => {
      const samples = [
        { type: "nullable", value: null },
        { type: "nullable", value: "not null" },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.type);
      const schema = schemas["nullable"];

      if (!schema) {
        throw new Error("Schema is undefined");
      }

      expect(schema.safeParse({ type: "nullable", value: null }).success).toBe(
        true,
      );
      expect(
        schema.safeParse({ type: "nullable", value: "string" }).success,
      ).toBe(true);
    });

    it("should handle deeply nested arrays", () => {
      const samples = [
        {
          type: "nested-array",
          data: [
            [1, 2],
            [3, 4],
          ],
        },
        {
          type: "nested-array",
          data: [
            [5, 6],
            [7, 8],
          ],
        },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.type);
      const schema = schemas["nested-array"];

      if (!schema) {
        throw new Error("Schema is undefined");
      }

      expect(
        schema.safeParse({
          type: "nested-array",
          data: [
            [9, 10],
            [11, 12],
          ],
        }).success,
      ).toBe(true);
      expect(
        schema.safeParse({ type: "nested-array", data: [["invalid"], [1, 2]] })
          .success,
      ).toBe(false);
    });
  });

  describe("Multiple Groups", () => {
    it("should handle multiple discriminated groups", () => {
      const samples = [
        { kind: "user", name: "John", age: 30 },
        { kind: "user", name: "Jane", age: 25 },
        { kind: "post", title: "Hello", content: "World" },
        { kind: "post", title: "Test", content: "Content" },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.kind);

      const userSchema = schemas["user"];
      const postSchema = schemas["post"];

      if (!userSchema || !postSchema) {
        throw new Error("Schema is undefined");
      }

      expect(Object.keys(schemas)).toEqual(["user", "post"]);

      // Test user schema
      expect(
        userSchema.safeParse({ kind: "user", name: "Bob", age: 35 }).success,
      ).toBe(true);
      expect(
        userSchema.safeParse({ kind: "user", name: 123, age: "invalid" })
          .success,
      ).toBe(false);

      // Test post schema
      expect(
        postSchema.safeParse({ kind: "post", title: "New", content: "Post" })
          .success,
      ).toBe(true);
      expect(
        postSchema.safeParse({ kind: "post", title: true, content: 123 })
          .success,
      ).toBe(false);
    });
  });

  describe("Schema Equivalence", () => {
    let analyzer: SchemaAnalyzer;

    beforeEach(() => {
      analyzer = new SchemaAnalyzer();
    });

    it("should reuse equivalent object schemas", () => {
      const samples = [
        { kind: "user", data: { name: "John", age: 30 } },
        { kind: "user", data: { name: "Jane", age: 25 } },
        { kind: "employee", data: { name: "Bob", age: 35 } },
        { kind: "employee", data: { name: "Alice", age: 28 } },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.kind);

      // Both schemas should be the exact same instance
      expect(schemas["user"]).toBe(schemas["employee"]);
    });

    it("should reuse equivalent array schemas", () => {
      const samples = [
        { kind: "numbers1", values: [1, 2, 3] },
        { kind: "numbers2", values: [4, 5, 6] },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.kind);
      expect(schemas["numbers1"]).toBe(schemas["numbers2"]);
    });

    it("should differentiate non-equivalent schemas", () => {
      const samples = [
        { kind: "stringArray", values: ["a", "b", "c"] },
        { kind: "numberArray", values: [1, 2, 3] },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.kind);
      expect(schemas["stringArray"]).not.toBe(schemas["numberArray"]);
    });

    it("should handle equivalent nested schemas", () => {
      const samples = [
        {
          kind: "nested1",
          data: {
            user: { name: "John", age: 30 },
            posts: [{ title: "Post 1" }, { title: "Post 2" }],
          },
        },
        {
          kind: "nested2",
          data: {
            user: { name: "Jane", age: 25 },
            posts: [{ title: "Post 3" }],
          },
        },
      ];

      const schemas = analyzer.analyzeSchema(samples, (s) => s.kind);
      expect(schemas["nested1"]).toBe(schemas["nested2"]);
    });

    it("should consider optional fields when comparing schemas", () => {
      const samples1 = [
        { kind: "withOptional1", data: { required: true, optional: "yes" } },
        { kind: "withOptional1", data: { required: false } },
      ];

      const samples2 = [
        { kind: "withOptional2", data: { required: true } },
        { kind: "withOptional2", data: { required: false, optional: "no" } },
      ];

      const schemas1 = analyzer.analyzeSchema(samples1, (s) => s.kind);
      const schemas2 = analyzer.analyzeSchema(samples2, (s) => s.kind);

      expect(schemas1["withOptional1"]).toBe(schemas2["withOptional2"]);
    });
  });
});
