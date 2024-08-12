import { createXXHasher } from "../hash-factory/hash-factory";
import { hashSchemaWithHasher } from "./hash-schema";

describe("hashSchemaWithHasher", () => {
  let xxHasher: (data: any) => string;

  beforeAll(async () => {
    xxHasher = await createXXHasher(0); // Use a fixed seed for reproducibility
  });

  it("should hash a simple object", async () => {
    const schema = { a: 1, b: "test", c: true };
    const hash = await hashSchemaWithHasher(xxHasher, schema);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should produce the same hash for identical objects", async () => {
    const schema1 = { x: 10, y: "hello" };
    const schema2 = { x: 10, y: "hello" };
    const hash1 = await hashSchemaWithHasher(xxHasher, schema1);
    const hash2 = await hashSchemaWithHasher(xxHasher, schema2);
    expect(hash1).toBe(hash2);
  });

  it("should produce different hashes for different objects", async () => {
    const schema1 = { a: 1, b: 2 };
    const schema2 = { a: 1, b: 3 };
    const hash1 = await hashSchemaWithHasher(xxHasher, schema1);
    const hash2 = await hashSchemaWithHasher(xxHasher, schema2);
    expect(hash1).not.toBe(hash2);
  });

  it("should handle nested objects", async () => {
    const schema = {
      outer: "value",
      inner: { a: 1, b: "test" },
    };
    const hash = await hashSchemaWithHasher(xxHasher, schema);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should handle arrays", async () => {
    const schema = {
      list: [1, 2, 3],
      object: { a: "test" },
    };
    const hash = await hashSchemaWithHasher(xxHasher, schema);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should be order-independent for object keys", async () => {
    const schema1 = { a: 1, b: 2, c: 3 };
    const schema2 = { c: 3, b: 2, a: 1 };
    const hash1 = await hashSchemaWithHasher(xxHasher, schema1);
    const hash2 = await hashSchemaWithHasher(xxHasher, schema2);
    expect(hash1).toBe(hash2);
  });

  it("should handle undefined values", async () => {
    const schema = { a: undefined, b: "defined" };
    const hash = await hashSchemaWithHasher(xxHasher, schema);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });

  it("should use the default hasher if none is provided", async () => {
    const schema = { test: "default hasher" };
    const hash = await hashSchemaWithHasher(undefined, schema);
    expect(typeof hash).toBe("string");
    expect(hash.length).toBeGreaterThan(0);
  });
});
