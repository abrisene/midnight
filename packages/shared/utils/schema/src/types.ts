// src/schema-analysis/types.ts
export type ScalarType = "string" | "number" | "boolean" | "null" | "undefined";
export type ComplexType = "object" | "array" | "union";
export type SchemaType = ScalarType | ComplexType;

export interface TypeConstraints {
  // String constraints
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  format?: "email" | "url" | "date" | "time" | "datetime" | "uuid";

  // Number constraints
  minimum?: number;
  maximum?: number;
  multipleOf?: number;
  isInteger?: boolean;

  // Array constraints
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // Object constraints
  minProperties?: number;
  maxProperties?: number;

  // Enum constraints
  enumValues?: any[];

  // Custom constraints
  customPatterns?: Map<string, number>; // pattern -> frequency
}

export interface SchemaNode {
  id: string;
  type: SchemaType;
  samples: number;
  optional?: boolean;
  constraints?: TypeConstraints;
  metadata: {
    createdAt: Date;
    lastUpdated: Date;
    frequency: number; // Frequency of occurrence in overall dataset
    confidence: number; // Confidence score for the type inference
  };
}

export interface ObjectNode extends SchemaNode {
  type: "object";
  properties: Map<string, string>; // property name -> node ID
}

export interface ArrayNode extends SchemaNode {
  type: "array";
  itemType: string; // node ID
}

export interface UnionNode extends SchemaNode {
  type: "union";
  types: string[]; // node IDs
}

export interface ScalarNode extends SchemaNode {
  type: ScalarType;
  examples: any[];
}

export type SchemaGraphNode = ObjectNode | ArrayNode | UnionNode | ScalarNode;

export interface GraphVisualizationNode {
  id: string;
  label: string;
  type: SchemaType;
  metrics: {
    samples: number;
    confidence: number;
    complexity: number;
  };
}

export interface GraphVisualizationEdge {
  from: string;
  to: string;
  label: string;
  type: "property" | "item" | "union";
}

export interface GraphVisualization {
  nodes: GraphVisualizationNode[];
  edges: GraphVisualizationEdge[];
}
