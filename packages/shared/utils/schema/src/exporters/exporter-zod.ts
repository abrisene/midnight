// src/exporters/zod-exporter.ts
import { z } from "zod";

import { SchemaGraph } from "../schema-graph";
import {
  ArrayNode,
  ObjectNode,
  SchemaGraphNode,
  TypeConstraints,
  UnionNode,
} from "../types";
import {
  generateZodSchemaSource,
  // getZodImportString,
  StringifyZodSchemaOptions,
} from "../utils/schema-stringifier";

export class ZodExporter {
  private visitedNodes: Set<string> = new Set();
  private graph: SchemaGraph = new SchemaGraph();

  /**
   * Exports the schema graph to a Zod schema, starting from the root node.
   * @param graph - The schema graph to export.
   * @param rootNodeId - Optional root node ID to start from.
   * @returns The root Zod schema.
   */
  export(graph: SchemaGraph, rootNodeId?: string): z.ZodType {
    this.graph = graph;
    this.visitedNodes.clear();

    // Find the root node - it should be the object node that contains all top-level properties
    const rootNode = this.findRootNode(graph, rootNodeId);

    if (!rootNode) {
      throw new Error("No valid root node found in graph");
    }

    return this.nodeToZodSchema(rootNode);
  }

  /**
   * Finds the root node in the graph by looking for the object node with the most properties
   * or uses the specified rootNodeId.
   */
  private findRootNode(
    graph: SchemaGraph,
    rootNodeId?: string,
  ): SchemaGraphNode | undefined {
    if (rootNodeId) {
      return graph.getNode(rootNodeId);
    }

    // Find the object node with the most properties - likely the root
    let rootNode: ObjectNode | undefined;
    let maxProperties = 0;

    for (const node of graph.getAllNodes()) {
      if (node.type === "object") {
        const objectNode = node as ObjectNode;
        const propertyCount = objectNode.properties.size;
        if (propertyCount > maxProperties) {
          maxProperties = propertyCount;
          rootNode = objectNode;
        }
      }
    }

    return rootNode;
  }

  /**
   * Exports the schema graph to a string of TypeScript code.
   * @param graph - The schema graph to export.
   * @param options - Options for exporting the schema.
   * @returns A string of TypeScript code for the Zod schema.
   */
  exportString(
    graph: SchemaGraph,
    options: StringifyZodSchemaOptions & {
      rootNodeId?: string;
      schemaName?: string;
    } = {},
  ): string {
    const schema = this.export(graph, options.rootNodeId);
    return generateZodSchemaSource(schema, options);
  }

  /**
   * Converts a schema graph node to a Zod schema.
   * @param node - The schema graph node to convert.
   * @returns The Zod schema.
   */
  private nodeToZodSchema(node: SchemaGraphNode): z.ZodType {
    // If we've seen this node before, return a reference to avoid infinite recursion
    if (this.visitedNodes.has(node.id)) {
      // For recursive types, we need to use z.lazy()
      return z.lazy(() => this.createZodSchema(node));
    }

    this.visitedNodes.add(node.id);
    return this.createZodSchema(node);
  }

  private createZodSchema(node: SchemaGraphNode): z.ZodType {
    let schema = this.createBaseSchema(node);

    // Apply constraints if they exist
    if (node.constraints) {
      schema = this.applyConstraints(schema, node.constraints);
    }

    // Make optional if needed
    if (node.optional) {
      schema = schema.optional();
    }

    return schema;
  }

  private createBaseSchema(node: SchemaGraphNode): z.ZodType {
    switch (node.type) {
      case "string":
        return z.string();
      case "number":
        return z.number();
      case "boolean":
        return z.boolean();
      case "null":
        return z.null();
      case "undefined":
        return z.undefined();
      case "object":
        return this.objectToZodSchema(node);
      case "array":
        return this.arrayToZodSchema(node);
      case "union":
        return this.unionToZodSchema(node);
      default:
        /* @ts-expect-error - Should be unreachable */
        throw new Error(`Unsupported node type: ${node.type}`);
    }
  }

  private objectToZodSchema(node: ObjectNode): z.ZodObject<any> {
    const shape: Record<string, z.ZodType> = {};

    for (const [key, nodeId] of node.properties) {
      const propertyNode = this.graph.getNode(nodeId);
      if (!propertyNode) {
        console.warn(`Missing property node: ${key} (${nodeId})`);
        continue;
      }

      try {
        shape[key] = this.nodeToZodSchema(propertyNode);
      } catch (error) {
        console.error(`Error processing property ${key}:`, error);
        throw error;
      }
    }

    return z.object(shape);
  }

  private arrayToZodSchema(node: ArrayNode): z.ZodArray<any> {
    const itemNode = this.graph.getNode(node.itemType);
    if (!itemNode) {
      throw new Error(`Missing array item type: ${node.itemType}`);
    }
    return z.array(this.nodeToZodSchema(itemNode));
  }

  private unionToZodSchema(node: UnionNode): z.ZodUnion<any> {
    const schemas = node.types
      .map((typeId) => this.graph.getNode(typeId))
      .filter((n): n is SchemaGraphNode => !!n)
      .map((n) => this.nodeToZodSchema(n));

    if (schemas.length < 2) {
      throw new Error("Union type must have at least 2 members");
    }

    return z.union([schemas[0]!, schemas[1]!, ...schemas.slice(2)]);
  }

  private applyConstraints(
    schema: z.ZodType,
    constraints: TypeConstraints,
  ): z.ZodType {
    if (isZodString(schema)) {
      constraints.minLength && schema.min(constraints.minLength);
      constraints.maxLength && schema.max(constraints.maxLength);
      constraints.pattern && schema.regex(constraints.pattern);

      if (constraints.format) {
        switch (constraints.format) {
          case "email":
            schema = schema.email();
            break;
          case "url":
            schema = schema.url();
            break;
          case "uuid":
            schema = schema.uuid();
            break;
        }
      }

      if (constraints.enumValues) {
        return z.enum(constraints.enumValues as [string, ...string[]]);
      }
    } else if (isZodNumber(schema)) {
      constraints.minimum && schema.min(constraints.minimum);
      constraints.maximum && schema.max(constraints.maximum);
      constraints.multipleOf && schema.multipleOf(constraints.multipleOf);
      constraints.isInteger && schema.int();
    } else if (isZodArray(schema)) {
      constraints.minItems && schema.min(constraints.minItems);
      constraints.maxItems && schema.max(constraints.maxItems);
      constraints.uniqueItems &&
        // Note: Zod doesn't have built-in unique items validation
        // You might want to implement this as a custom refinement
        schema.refine((items) => {
          const set = new Set(items);
          return set.size === items.length;
        }, "Array items must be unique");
    }

    return schema;
  }
}

function isZodType(schema: z.ZodType): schema is z.ZodType {
  return true;
}

function isZodString(schema: z.ZodType): schema is z.ZodString {
  return schema instanceof z.ZodString;
}

function isZodNumber(schema: z.ZodType): schema is z.ZodNumber {
  return schema instanceof z.ZodNumber;
}

function isZodBoolean(schema: z.ZodType): schema is z.ZodBoolean {
  return schema instanceof z.ZodBoolean;
}

function isZodNull(schema: z.ZodType): schema is z.ZodNull {
  return schema instanceof z.ZodNull;
}

function isZodUndefined(schema: z.ZodType): schema is z.ZodUndefined {
  return schema instanceof z.ZodUndefined;
}

function isZodObject(schema: z.ZodType): schema is z.ZodObject<any> {
  return schema instanceof z.ZodObject;
}

function isZodArray(schema: z.ZodType): schema is z.ZodArray<any> {
  return schema instanceof z.ZodArray;
}

function isZodUnion(schema: z.ZodType): schema is z.ZodUnion<any> {
  return schema instanceof z.ZodUnion;
}

function isZodLazy(schema: z.ZodType): schema is z.ZodLazy<any> {
  return schema instanceof z.ZodLazy;
}
