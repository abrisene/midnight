// src/types/schema.ts
export interface FunctionSchema {
  /**
   * The name of the function. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
   */
  name: string;

  /**
   * A description of what the function does, used by the LLM to determine when to call this function.
   */
  description: string;

  /**
   * The parameters that the function accepts, described as a JSON Schema object.
   */
  parameters: {
    type: "object";
    properties: Record<string, ParameterSchema>;
    required?: string[];
  };

  /**
   * Optional response schema for the function.
   */
  returns?: ParameterSchema;

  /**
   * Metadata about the function schema
   */
  metadata?: FunctionMetadata;
}

export interface ParameterSchema {
  type:
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "array"
    | "object"
    | "null";
  description?: string;
  enum?: any[];
  items?: ParameterSchema; // For arrays
  properties?: Record<string, ParameterSchema>; // For objects
  required?: string[]; // For objects
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: string;
  default?: any;
  examples?: any[];
}

export interface FunctionMetadata {
  /**
   * Confidence score (0-1) in the schema accuracy
   */
  confidence: number;

  /**
   * Number of requests analyzed to generate this schema
   */
  sampleSize: number;

  /**
   * Timestamp when the schema was last updated
   */
  lastUpdated: Date;

  /**
   * Version number of the schema
   */
  version: number;

  /**
   * Information about breaking changes from previous versions
   */
  breakingChanges?: BreakingChange[];

  /**
   * Usage statistics
   */
  usage?: {
    totalCalls: number;
    successRate: number;
    averageLatency: number;
    lastUsed: Date;
  };
}

export interface BreakingChange {
  version: number;
  date: Date;
  description: string;
  changes: {
    type: "added" | "removed" | "modified" | "renamed";
    path: string;
    oldValue?: any;
    newValue?: any;
  }[];
}

// Helper types for schema generation
export type SchemaType =
  | { type: "string"; format?: string }
  | { type: "number" }
  | { type: "integer" }
  | { type: "boolean" }
  | { type: "array"; items: SchemaType }
  | {
      type: "object";
      properties: Record<string, SchemaType>;
      required?: string[];
    }
  | { type: "null" };

// Helper functions for schema generation
export const createStringSchema = (format?: string): ParameterSchema => ({
  type: "string",
  ...(format ? { format } : {}),
});

export const createNumberSchema = (): ParameterSchema => ({
  type: "number",
});

export const createIntegerSchema = (): ParameterSchema => ({
  type: "integer",
});

export const createBooleanSchema = (): ParameterSchema => ({
  type: "boolean",
});

export const createArraySchema = (items: ParameterSchema): ParameterSchema => ({
  type: "array",
  items,
});

export const createObjectSchema = (
  properties: Record<string, ParameterSchema>,
  required?: string[],
): ParameterSchema => ({
  type: "object",
  properties,
  ...(required ? { required } : {}),
});

// Utility function to convert Zod schema to FunctionSchema
export const zodToFunctionSchema = (
  name: string,
  description: string,
  zodSchema: any, // TODO: Add proper Zod type
  metadata?: FunctionMetadata,
): FunctionSchema => {
  // Implementation detail to be added
  return {
    name,
    description,
    parameters: {
      type: "object",
      properties: {}, // Convert Zod schema to OpenAI function schema format
    },
    metadata,
  };
};

// Utility function to convert FunctionSchema to Zod schema
export const functionSchemaToZod = (schema: FunctionSchema): any => {
  // Implementation detail to be added
  return {}; // Convert OpenAI function schema format to Zod schema
};

// Type guard functions
export const isFunctionSchema = (schema: any): schema is FunctionSchema => {
  return (
    typeof schema === "object" &&
    schema !== null &&
    typeof schema.name === "string" &&
    typeof schema.description === "string" &&
    typeof schema.parameters === "object" &&
    schema.parameters.type === "object" &&
    typeof schema.parameters.properties === "object"
  );
};

export const isParameterSchema = (schema: any): schema is ParameterSchema => {
  return (
    typeof schema === "object" &&
    schema !== null &&
    typeof schema.type === "string" &&
    [
      "string",
      "number",
      "integer",
      "boolean",
      "array",
      "object",
      "null",
    ].includes(schema.type)
  );
};
