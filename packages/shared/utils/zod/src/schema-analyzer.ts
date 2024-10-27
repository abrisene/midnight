// src/schema-analyzer.ts
import { z } from "zod";

import { generateSchemaCode, stringifySchema } from "./schema-stringifier";

interface SchemaSignature {
  type: "string" | "number" | "boolean" | "array" | "object" | "union" | "null";
  properties?: Record<string, SchemaSignature>;
  items?: SchemaSignature; // For arrays
  unionTypes?: SchemaSignature[]; // For unions
  isOptional?: boolean;
}

export class SchemaAnalyzer {
  private sampleThreshold = 100; // Minimum samples needed for high confidence
  private schemaRegistry: Map<
    string,
    { schema: z.ZodType; signature: SchemaSignature }
  > = new Map();

  /**
   * Analyze an array of samples to infer Zod schemas for each group.
   * @param samples - An array of samples.
   * @param discriminator - A function to determine the group for each sample.
   * @returns A record of group keys and their corresponding Zod schemas.
   */
  analyzeSchema(
    samples: any[],
    discriminator: (sample: any) => string,
  ): Record<string, z.ZodType<any>> {
    const groupedSamples = this.groupSamples(samples, discriminator);
    const schemas: Record<string, z.ZodType> = {};

    for (const [group, groupSamples] of Object.entries(groupedSamples)) {
      const schema = this.inferSchema(groupSamples as any[]);

      // Try to find an equivalent schema before creating a new one
      const existingSchema = this.findEquivalentSchema(schema);
      if (existingSchema) {
        schemas[group] = existingSchema;
      } else {
        this.registerSchema(schema);
        schemas[group] = schema;
      }
    }

    return schemas;
  }

  private groupSamples<T>(
    samples: T[],
    discriminator: (sample: T) => string,
  ): Record<string, T[]> {
    return samples.reduce<Record<string, T[]>>((acc, sample) => {
      const key = discriminator(sample);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(sample);
      return acc;
    }, {});
  }

  private inferSchema(samples: any[]): z.ZodSchema<any> {
    if (samples.length === 0) {
      return z.any();
    }

    // Map to hold samples by type
    const typeSamplesMap = new Map<string, any[]>();

    samples.forEach((sample) => {
      let type: string;
      if (sample === null) {
        type = "null";
      } else if (Array.isArray(sample)) {
        type = "array";
      } else {
        type = typeof sample;
      }

      if (!typeSamplesMap.has(type)) {
        typeSamplesMap.set(type, []);
      }
      typeSamplesMap.get(type)!.push(sample);
    });

    const typeSchemas: z.ZodSchema<any>[] = [];

    // Infer schema for each type
    for (const [type, typeSamples] of Array.from(typeSamplesMap.entries())) {
      // Infer schema based on the type
      switch (type) {
        case "object":
          typeSchemas.push(
            this.inferObjectSchema(typeSamples.filter((s) => s !== null)),
          );
          break;
        case "array":
          typeSchemas.push(this.inferArraySchema(typeSamples));
          break;
        case "string":
          typeSchemas.push(z.string());
          break;
        case "number":
          typeSchemas.push(z.number());
          break;
        case "boolean":
          typeSchemas.push(z.boolean());
          break;
        case "null":
          typeSchemas.push(z.null());
          break;
        default:
          typeSchemas.push(z.any());
          break;
      }
    }

    // If no type schemas, return undefined
    if (typeSchemas.length === 0) {
      return z.undefined();
    }

    // If there is only one type schema, return it
    if (typeSchemas.length === 1) {
      return typeSchemas[0] ?? z.any();
    } else {
      const schemas = typeSchemas.filter(
        (s) => s !== undefined,
      ) as z.ZodSchema<any>[];
      return z.union([schemas[0]!, schemas[1]!, ...schemas.slice(2)]);
    }
  }

  /**
   * Infer a Zod schema for an object from an array of object samples.
   * @param samples - An array of object samples.
   * @returns A Zod schema for the object.
   */
  private inferObjectSchema(samples: object[]): z.ZodObject<any> {
    const propertyValuesMap: Record<string, any[]> = {};
    const propertyPresenceCounts: Record<string, number> = {};

    // Collect values for each property
    samples.forEach((sample) => {
      Object.keys(sample).forEach((key) => {
        if (!propertyValuesMap[key]) {
          propertyValuesMap[key] = [];
          propertyPresenceCounts[key] = 0;
        }
        const value = sample[key as keyof typeof sample];
        propertyValuesMap[key].push(value);
        if (value !== undefined) {
          propertyPresenceCounts[key] = (propertyPresenceCounts[key] ?? 0) + 1;
        }
      });
    });

    const totalSamples = samples.length;
    const propertySchemas: Record<string, z.ZodSchema<any>> = {};

    // Infer schema for each property
    for (const key in propertyValuesMap) {
      const values = propertyValuesMap[key];
      const presenceCount = propertyPresenceCounts[key] ?? 0;

      // Determine if the property is optional based on its presence in the samples
      const isOptional = presenceCount / totalSamples < 0.9; // 90% threshold for required fields
      const schema = this.inferSchema(values ?? []);

      // Set the property schema to be optional if it is not present in most samples
      propertySchemas[key] = isOptional ? schema.optional() : schema;
    }

    // Create the final object schema
    return z.object(propertySchemas);
  }

  /**
   * Infer a Zod schema for an array from an array of array samples.
   * @param samples - An array of array samples.
   * @returns A Zod schema for the array.
   */
  private inferArraySchema(samples: any[][]): z.ZodArray<any> {
    const itemSamples = samples.flat();
    const itemSchema = this.inferSchema(itemSamples);
    return z.array(itemSchema);
  }

  private createSchemaSignature(schema: z.ZodType): SchemaSignature {
    if (schema instanceof z.ZodString) {
      return { type: "string" };
    }
    if (schema instanceof z.ZodNumber) {
      return { type: "number" };
    }
    if (schema instanceof z.ZodBoolean) {
      return { type: "boolean" };
    }
    if (schema instanceof z.ZodNull) {
      return { type: "null" };
    }
    if (schema instanceof z.ZodArray) {
      return {
        type: "array",
        items: this.createSchemaSignature(schema.element),
      };
    }
    if (schema instanceof z.ZodObject) {
      const shape = schema.shape as Record<string, z.ZodType>;
      const properties: Record<string, SchemaSignature> = {};

      for (const [key, value] of Object.entries(shape)) {
        const isOptional = value instanceof z.ZodOptional;
        const innerType = isOptional
          ? (value as z.ZodOptional<z.ZodType>).unwrap()
          : value;
        properties[key] = {
          ...this.createSchemaSignature(innerType),
          isOptional,
        };
      }

      return {
        type: "object",
        properties,
      };
    }
    if (schema instanceof z.ZodUnion) {
      return {
        type: "union",
        unionTypes: schema.options.map((option: z.ZodType) =>
          this.createSchemaSignature(option),
        ),
      };
    }

    throw new Error(`Unsupported schema type: ${schema.constructor.name}`);
  }

  private areSignaturesEquivalent(
    sig1?: SchemaSignature,
    sig2?: SchemaSignature,
  ): boolean {
    if (!sig1 && !sig2) return true;
    if (!sig1 || !sig2) return false;
    if (sig1.type !== sig2.type) return false;
    if (sig1.isOptional !== sig2.isOptional) return false;
    if (sig1.type === "array") {
      if (!sig1.items || !sig2.items) return false;
      return this.areSignaturesEquivalent(sig1.items, sig2.items);
    }

    if (sig1.type === "object") {
      const props1 = sig1.properties || {};
      const props2 = sig2.properties || {};
      const keys1 = Object.keys(props1);
      const keys2 = Object.keys(props2);

      if (keys1.length !== keys2.length) return false;

      return keys1.every((key) => {
        if (!(key in props2)) return false;
        return this.areSignaturesEquivalent(props1[key], props2[key]);
      });
    }

    if (sig1.type === "union") {
      const types1 = sig1.unionTypes || [];
      const types2 = sig2.unionTypes || [];

      if (types1.length !== types2.length) return false;

      // Check if every type in types1 has a matching type in types2
      return types1.every((type1) =>
        types2.some((type2) => this.areSignaturesEquivalent(type1, type2)),
      );
    }

    return true;
  }

  private findEquivalentSchema(schema: z.ZodType): z.ZodType | null {
    const signature = this.createSchemaSignature(schema);

    for (const [_, registered] of this.schemaRegistry) {
      if (this.areSignaturesEquivalent(signature, registered.signature)) {
        return registered.schema;
      }
    }

    return null;
  }

  private registerSchema(schema: z.ZodType): void {
    const signature = this.createSchemaSignature(schema);
    const hash = JSON.stringify(signature); // Simple hashing for now
    this.schemaRegistry.set(hash, { schema, signature });
  }

  // Add this method to the SchemaAnalyzer class
  generateSchemaCode(
    samples: any[],
    discriminator: (sample: any) => string,
    options: { schemaName?: string } = {},
  ): string {
    const schemas = this.analyzeSchema(samples, discriminator);
    const { schemaName } = options;

    if (Object.keys(schemas).length === 1 && schemaName) {
      // If there's only one schema and a name is provided, export it as a named constant
      const schema = Object.values(schemas)[0];
      return generateSchemaCode(schema!, { schemaName });
    }

    // For multiple schemas, generate a type for each one
    const imports = 'import { z } from "zod";\n\n';
    const schemaCode = Object.entries(schemas)
      .map(([key, schema]) => {
        const typeName = `${key.charAt(0).toUpperCase()}${key.slice(1)}Schema`;
        return `export const ${typeName} = ${stringifySchema(schema)};\n`;
      })
      .join("\n");

    return `${imports}${schemaCode}`;
  }
}
