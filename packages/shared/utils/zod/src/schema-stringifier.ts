import { z } from "zod";

interface StringifyOptions {
  indentSpaces?: number;
  useImportedZod?: boolean;
}

export function stringifySchema(
  schema: z.ZodType,
  options: StringifyOptions = {},
): string {
  const { indentSpaces = 2, useImportedZod = true } = options;
  const zodPrefix = useImportedZod ? "z." : "zod.";

  function stringify(schema: z.ZodType, indent = 0): string {
    const spaces = " ".repeat(indent);

    if (schema instanceof z.ZodString) {
      return `${zodPrefix}string()`;
    }

    if (schema instanceof z.ZodNumber) {
      return `${zodPrefix}number()`;
    }

    if (schema instanceof z.ZodBoolean) {
      return `${zodPrefix}boolean()`;
    }

    if (schema instanceof z.ZodNull) {
      return `${zodPrefix}null()`;
    }

    if (schema instanceof z.ZodUndefined) {
      return `${zodPrefix}undefined()`;
    }

    if (schema instanceof z.ZodAny) {
      return `${zodPrefix}any()`;
    }

    if (schema instanceof z.ZodArray) {
      return `${zodPrefix}array(${stringify(schema.element)})`;
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
        return `${zodPrefix}object({})`;
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

      return `${zodPrefix}object({\n${fields}\n${spaces}})`;
    }

    if (schema instanceof z.ZodUnion) {
      const types = schema.options;
      return `${zodPrefix}union([${types
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
      return `${zodPrefix}literal(${
        typeof value === "string" ? `"${value}"` : value
      })`;
    }

    if (schema instanceof z.ZodEnum) {
      const values = schema._def.values;
      return `${zodPrefix}enum([${values
        .map((v: string) => `"${v}"`)
        .join(", ")}])`;
    }

    if (schema instanceof z.ZodRecord) {
      return `${zodPrefix}record(${stringify(schema._def.valueType)})`;
    }

    throw new Error(`Unsupported schema type: ${schema.constructor.name}`);
  }

  return stringify(schema);
}

/**
 * Generates TypeScript code for a Zod schema, including the import statement if needed.
 */
export function generateSchemaCode(
  schema: z.ZodType,
  options: StringifyOptions & { schemaName?: string } = {},
): string {
  const { useImportedZod = true, schemaName } = options;
  const importStatement = useImportedZod ? 'import { z } from "zod";\n\n' : "";
  const schemaString = stringifySchema(schema, options);

  if (schemaName) {
    return `${importStatement}export const ${schemaName} = ${schemaString};\n`;
  }

  return `${importStatement}${schemaString};\n`;
}
