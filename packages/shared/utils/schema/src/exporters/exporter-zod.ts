// src/exporters/zod-exporter.ts
import { z } from "zod";

import { SchemaGraph } from "../schema-graph";
import {
  ArrayNode,
  ObjectNode,
  ScalarType,
  SchemaGraphNode,
  SchemaType,
  UnionNode,
} from "../types";

export class ZodExporter {
  export(graph: SchemaGraph): Record<string, z.ZodType> {
    const schemas: Record<string, z.ZodType> = {};

    for (const node of graph.getAllNodes()) {
      schemas[node.id] = this.nodeToZodSchema(node, graph);
    }

    return schemas;
  }

  private nodeToZodSchema(
    node: SchemaGraphNode,
    graph: SchemaGraph,
  ): z.ZodType {
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
        return this.objectToZodSchema(node, graph);
      case "array":
        return this.arrayToZodSchema(node, graph);
      case "union":
        return this.unionToZodSchema(node, graph);
      default:
        /* @ts-expect-error - This should never happen */
        throw new Error(`Unsupported node type: ${node.type}`);
    }
  }

  private objectToZodSchema(
    node: ObjectNode,
    graph: SchemaGraph,
  ): z.ZodObject<any> {
    const shape: Record<string, z.ZodType> = {};

    for (const [key, nodeId] of node.properties) {
      const propertyNode = graph.getNode(nodeId);
      if (!propertyNode) continue;

      let schema = this.nodeToZodSchema(propertyNode, graph);
      if (propertyNode.optional) {
        schema = schema.optional();
      }
      shape[key] = schema;
    }

    return z.object(shape);
  }

  private arrayToZodSchema(
    node: ArrayNode,
    graph: SchemaGraph,
  ): z.ZodArray<any> {
    const itemNode = graph.getNode(node.itemType);
    if (!itemNode) throw new Error(`Missing array item type: ${node.itemType}`);
    return z.array(this.nodeToZodSchema(itemNode, graph));
  }

  private unionToZodSchema(
    node: UnionNode,
    graph: SchemaGraph,
  ): z.ZodUnion<any> {
    const schemas = node.types
      .map((typeId) => graph.getNode(typeId))
      .filter((n): n is SchemaGraphNode => !!n)
      .map((n) => this.nodeToZodSchema(n, graph));

    return z.union([schemas[0]!, schemas[1]!, ...schemas.slice(2)]);
  }
}
