// src/schema/analyzer.ts
import { z } from "zod";

export class SchemaAnalyzer {
  private sampleThreshold = 100; // Minimum samples needed for high confidence

  analyzeSchema(samples: any[]): z.ZodSchema<any> {
    return this.inferSchema(samples);
  }

  private inferSchema(samples: any[]): z.ZodSchema<any> {
    if (samples.length === 0) {
      return z.any();
    }

    // Get the type that appears most frequently
    const typeFrequency = new Map<string, number>();
    samples.forEach((sample) => {
      const type = Array.isArray(sample) ? "array" : typeof sample;
      typeFrequency.set(type, (typeFrequency.get(type) || 0) + 1);
    });

    const [mostCommonType] = [...typeFrequency.entries()].sort(
      (a, b) => b[1] - a[1],
    )[0];

    switch (mostCommonType) {
      case "object":
        return this.inferObjectSchema(
          samples.filter((s) => typeof s === "object" && s !== null),
        );
      case "array":
        return this.inferArraySchema(samples.filter(Array.isArray));
      case "string":
        return z.string();
      case "number":
        return z.number();
      case "boolean":
        return z.boolean();
      default:
        return z.any();
    }
  }

  private inferObjectSchema(samples: object[]): z.ZodObject<any> {
    const propertySchemas: Record<string, z.ZodSchema> = {};
    const propertyPresence = new Map<string, number>();

    // Count property presence
    samples.forEach((sample) => {
      Object.keys(sample).forEach((key) => {
        propertyPresence.set(key, (propertyPresence.get(key) || 0) + 1);
      });
    });

    // For each property, get all values and infer schema
    for (const [property, presence] of propertyPresence) {
      const values = samples
        .map((sample) => sample[property as keyof typeof sample])
        .filter((value) => value !== undefined);

      const isOptional = presence / samples.length < 0.9; // 90% threshold for required fields
      let schema = this.inferSchema(values);

      if (isOptional) {
        schema = schema.optional();
      }

      propertySchemas[property] = schema;
    }

    return z.object(propertySchemas);
  }

  private inferArraySchema(samples: any[][]): z.ZodArray<any> {
    const itemSamples = samples.flat();
    const itemSchema = this.inferSchema(itemSamples);
    return z.array(itemSchema);
  }
}
