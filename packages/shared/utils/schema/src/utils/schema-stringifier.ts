// src/utils/schema-stringifier.ts
import { z } from "zod";

export interface StringifyZodSchemaOptions {
  indentSpaces?: number;
  useImportedZod?: boolean;
  zodPrefix?: string;
}

/**
 * Generates TypeScript code for a Zod schema, including the import statement if needed
 * @param schema - The Zod schema to generate code for.
 * @param options - Options for generating the code.
 * @returns The TypeScript code for the Zod schema.
 */
export function generateZodSchemaSource(
  schema: z.ZodType,
  options: StringifyZodSchemaOptions & { schemaName?: string } = {},
): string {
  const { useImportedZod = true, schemaName, zodPrefix = "z" } = options;
  const importStatement = getZodImportString(useImportedZod, zodPrefix);
  const schemaString = stringifyZodSchema(schema, options);

  if (schemaName) {
    return `${importStatement}export const ${schemaName} = ${schemaString};\n`;
  }

  return `${importStatement}${schemaString};\n`;
}

/**
 * Stringifies a Zod schema to a string.
 * @param schema - The Zod schema to stringify.
 * @param options - Options for stringifying the Zod schema.
 * @returns The stringified Zod schema.
 */
export function stringifyZodSchema(
  schema: z.ZodType,
  options: StringifyZodSchemaOptions = {},
): string {
  const { indentSpaces = 2, useImportedZod = true, zodPrefix = "z" } = options;
  const prefix = zodPrefix.endsWith(".") ? zodPrefix : `${zodPrefix}.`;
  function stringify(schema: z.ZodType, indent = 0): string {
    const spaces = " ".repeat(indent);

    if (schema instanceof z.ZodString) {
      return `${prefix}string()`;
    }

    if (schema instanceof z.ZodNumber) {
      return `${prefix}number()`;
    }

    if (schema instanceof z.ZodBoolean) {
      return `${prefix}boolean()`;
    }

    if (schema instanceof z.ZodNull) {
      return `${prefix}null()`;
    }

    if (schema instanceof z.ZodUndefined) {
      return `${prefix}undefined()`;
    }

    if (schema instanceof z.ZodAny) {
      return `${prefix}any()`;
    }

    if (schema instanceof z.ZodArray) {
      return `${prefix}array(${stringify(schema.element)})`;
    }

    if (schema instanceof z.ZodOptional) {
      return `${stringify(schema.unwrap())}.optional()`;
    }

    if (schema instanceof z.ZodNullable) {
      return `${stringify(schema.unwrap())}.nullable()`;
    }

    if (schema instanceof z.ZodObject) {
      const shape = schema.shape as Record<string, z.ZodType>;
      const entries = Object.entries(shape);

      if (entries.length === 0) {
        return `${prefix}object({})`;
      }

      const innerIndent = indent + indentSpaces;
      const innerSpaces = " ".repeat(innerIndent);

      const fields = entries
        .map(([key, value]) => {
          const isValidIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key);
          const formattedKey = isValidIdentifier ? key : `"${key}"`;
          return `${innerSpaces}${formattedKey}: ${stringify(value, innerIndent)}`;
        })
        .join(",\n");

      return `${prefix}object({\n${fields}\n${spaces}})`;
    }

    if (schema instanceof z.ZodUnion) {
      const types = schema.options;
      return `${prefix}union([${types
        .map((type: z.ZodType) => stringify(type))
        .join(", ")}])`;
    }

    if (schema instanceof z.ZodIntersection) {
      return `${stringify(schema._def.left)}.and(${stringify(
        schema._def.right,
      )})`;
    }

    if (schema instanceof z.ZodLiteral) {
      const value = schema._def.value;
      return `${prefix}literal(${
        typeof value === "string" ? `"${value}"` : value
      })`;
    }

    if (schema instanceof z.ZodEnum) {
      const values = schema._def.values;
      return `${prefix}enum([${values
        .map((v: string) => `"${v}"`)
        .join(", ")}])`;
    }

    if (schema instanceof z.ZodRecord) {
      return `${prefix}record(${stringify(schema._def.valueType)})`;
    }

    throw new Error(`Unsupported schema type: ${schema.constructor.name}`);
  }

  return stringify(schema);
}

/**
 * Returns the import statement for Zod if `useImportedZod` is true, otherwise an empty string.
 * @param useImportedZod - Whether to use the imported Zod.
 * @param zodPrefix - The prefix to use for the Zod import.
 * @returns The import statement for Zod.
 */
export function getZodImportString(useImportedZod = false, zodPrefix = "z") {
  return useImportedZod
    ? `import { ${zodPrefix === "z" ? "z" : `z as ${zodPrefix}`} } from "zod";\n\n`
    : "";
}
