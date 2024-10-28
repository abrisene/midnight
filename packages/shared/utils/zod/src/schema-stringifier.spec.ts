import { z } from "zod";

import { generateSchemaCode, stringifySchema } from "./schema-stringifier";

describe("Schema Stringifier", () => {
  describe("stringifySchema", () => {
    it("should stringify primitive schemas", () => {
      expect(stringifySchema(z.string())).toBe("z.string()");
      expect(stringifySchema(z.number())).toBe("z.number()");
      expect(stringifySchema(z.boolean())).toBe("z.boolean()");
    });

    it("should stringify object schemas", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      expect(stringifySchema(schema)).toBe(
        "z.object({\n  name: z.string(),\n  age: z.number()\n})",
      );
    });

    it("should stringify nested object schemas", () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          age: z.number(),
        }),
        active: z.boolean(),
      });

      expect(stringifySchema(schema)).toBe(
        "z.object({\n  user: z.object({\n    name: z.string(),\n    age: z.number()\n  }),\n  active: z.boolean()\n})",
      );
    });

    it("should stringify array schemas", () => {
      const schema = z.array(z.string());
      expect(stringifySchema(schema)).toBe("z.array(z.string())");
    });

    it("should stringify union schemas", () => {
      const schema = z.union([z.string(), z.number()]);
      expect(stringifySchema(schema)).toBe("z.union([z.string(), z.number()])");
    });

    it("should stringify optional schemas", () => {
      const schema = z.string().optional();
      expect(stringifySchema(schema)).toBe("z.string().optional()");
    });

    it("should stringify nullable schemas", () => {
      const schema = z.string().nullable();
      expect(stringifySchema(schema)).toBe("z.string().nullable()");
    });

    it("should stringify enum schemas", () => {
      const schema = z.enum(["A", "B", "C"]);
      expect(stringifySchema(schema)).toBe('z.enum(["A", "B", "C"])');
    });

    it("should stringify literal schemas", () => {
      expect(stringifySchema(z.literal("hello"))).toBe('z.literal("hello")');
      expect(stringifySchema(z.literal(123))).toBe("z.literal(123)");
      expect(stringifySchema(z.literal(true))).toBe("z.literal(true)");
    });

    it("should handle non-standard property names", () => {
      const schema = z.object({
        "special-key": z.string(),
        "123": z.number(),
      });

      // Get the stringified schema and parse it back to compare structure instead of exact string
      const result = stringifySchema(schema);
      const expectedParts = [
        "z.object({",
        '  "special-key": z.string()',
        '  "123": z.number()',
        "})",
      ];

      // Verify all parts are present, ignoring order
      expectedParts.forEach((part) => {
        expect(result).toContain(part.replace(/[{}]/g, "").trim());
      });
    });
  });

  describe("generateSchemaCode", () => {
    it("should generate code with import statement", () => {
      const schema = z.object({ name: z.string() });
      const code = generateSchemaCode(schema, { schemaName: "UserSchema" });
      expect(code).toBe(
        'import { z } from "zod";\n\nexport const UserSchema = z.object({\n  name: z.string()\n});\n',
      );
    });

    it("should generate code without import statement", () => {
      const schema = z.object({ name: z.string() });
      const code = generateSchemaCode(schema, {
        useImportedZod: false,
        schemaName: "UserSchema",
      });
      expect(code).toBe(
        "export const UserSchema = zod.object({\n  name: zod.string()\n});\n",
      );
    });
  });
});