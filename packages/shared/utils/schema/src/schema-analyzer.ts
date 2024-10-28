// src/schema-analyzer.ts
import { SchemaGraph } from "./schema-graph";
import {
  ArrayNode,
  ObjectNode,
  ScalarNode,
  ScalarType,
  SchemaType,
  UnionNode,
} from "./types";

export class SchemaAnalyzer {
  private graph: SchemaGraph = new SchemaGraph();
  private sampleThreshold = 100;

  /**
   * Analyze a given set of samples and return the ID of the root node in the graph.
   * @param samples - The sample(s) to analyze.
   * @returns The ID of the root node in the graph.
   */
  analyze(samples: any): string {
    const sampleArray = Array.isArray(samples) ? samples : [samples];
    return this.inferSchema(sampleArray);
  }

  /**
   * Infer the schema of a given set of samples.
   * @param samples - The samples to infer the schema of.
   * @returns The ID of the root node in the graph.
   */
  private inferSchema(samples: any[]): string {
    if (samples.length === 0) return this.createScalarNode("undefined", []);

    const typeMap = new Map<SchemaType, any[]>();

    // Group samples by type
    for (const sample of samples) {
      const type = this.getType(sample);
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type)!.push(sample);
    }
    if (typeMap.size === 1) {
      const entry = Array.from(typeMap.entries())[0];
      if (!entry) {
        return this.createScalarNode("undefined", []);
      }
      const [type, typeSamples] = entry;
      return this.createTypeNode(type, typeSamples);
    }

    // Create union node for multiple types
    const typeNodes = Array.from(typeMap.entries()).map(([type, typeSamples]) =>
      this.createTypeNode(type, typeSamples),
    );

    return this.graph.addNode<UnionNode>({
      type: "union",
      types: typeNodes,
      samples: samples.length,
    });
  }

  /**
   * Determine the type of a given value.
   * @param value - The value to determine the type of.
   * @returns The type of the value.
   */
  private getType(value: any): SchemaType {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (Array.isArray(value)) return "array";
    return typeof value as SchemaType;
  }

  /**
   * Create a node for a given type.
   * @param type - The type of the node to create.
   * @param samples - The samples to create the node with.
   * @returns The ID of the created node.
   */
  private createTypeNode(type: SchemaType, samples: any[]): string {
    switch (type) {
      case "object":
        return this.createObjectNode(samples);
      case "array":
        return this.createArrayNode(samples);
      default:
        return this.createScalarNode(type as ScalarType, samples);
    }
  }

  /**
   * Create an object node for a given set of samples.
   * @param samples - The samples to create the object node with.
   * @returns The ID of the created node.
   */
  private createObjectNode(samples: object[]): string {
    const properties = new Map<string, any[]>();

    // Collect property samples
    for (const sample of samples) {
      for (const [key, value] of Object.entries(sample)) {
        if (!properties.has(key)) {
          properties.set(key, []);
        }
        properties.get(key)!.push(value);
      }
    }

    // Create property nodes
    const propertyNodes = new Map<string, string>();
    for (const [key, propertySamples] of properties) {
      // Fix: Calculate optionality based on sample presence
      const isOptional = propertySamples.length < samples.length;
      const propertyType = this.inferSchema(propertySamples);

      // Set optional flag on the node
      const node = this.graph.getNode(propertyType);
      if (node) {
        node.optional = isOptional;
        this.graph.updateNode(node.id, node);
      }

      propertyNodes.set(key, propertyType);
    }

    return this.graph.addNode<ObjectNode>({
      type: "object",
      properties: propertyNodes,
      samples: samples.length,
    });
  }

  /**
   * Create an array node for a given set of samples.
   * @param samples - The samples to create the array node with.
   * @returns The ID of the created node.
   */
  private createArrayNode(samples: any[][]): string {
    const itemSamples = samples.flat();
    const itemType = this.inferSchema(itemSamples);

    return this.graph.addNode<ArrayNode>({
      type: "array",
      itemType,
      samples: samples.length,
    });
  }

  /**
   * Create a scalar node for a given type and samples.
   * @param type - The type of the scalar node to create.
   * @param samples - The samples to create the scalar node with.
   * @returns The ID of the created node.
   */
  private createScalarNode(type: ScalarType, samples: any[]): string {
    return this.graph.addNode<ScalarNode>({
      type,
      samples: samples.length,
      examples: samples.slice(0, 5), // Keep a few examples for reference
    });
  }
}
