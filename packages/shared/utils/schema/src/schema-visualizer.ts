// src/schema-visualizer.ts
import { SchemaGraph } from "./schema-graph";
import {
  ArrayNode,
  GraphVisualization,
  GraphVisualizationEdge,
  GraphVisualizationNode,
  ObjectNode,
  SchemaGraphNode,
  UnionNode,
} from "./types";

export class SchemaVisualizer {
  private graph: SchemaGraph;

  constructor(graph: SchemaGraph) {
    this.graph = graph;
  }

  generateVisualization(): GraphVisualization {
    const nodes: GraphVisualizationNode[] = [];
    const edges: GraphVisualizationEdge[] = [];

    for (const node of this.graph.getAllNodes()) {
      nodes.push(this.createVisualizationNode(node));

      if (this.isObjectNode(node)) {
        for (const [prop, targetId] of node.properties) {
          edges.push({
            from: node.id,
            to: targetId,
            label: prop,
            type: "property",
          });
        }
      } else if (this.isArrayNode(node)) {
        edges.push({
          from: node.id,
          to: node.itemType,
          label: "items",
          type: "item",
        });
      } else if (this.isUnionNode(node)) {
        for (const typeId of node.types) {
          edges.push({
            from: node.id,
            to: typeId,
            label: "type",
            type: "union",
          });
        }
      }
    }

    return { nodes, edges };
  }

  private createVisualizationNode(
    node: SchemaGraphNode,
  ): GraphVisualizationNode {
    return {
      id: node.id,
      label: this.generateNodeLabel(node),
      type: node.type,
      metrics: {
        samples: node.samples,
        confidence: node.metadata.confidence,
        complexity: this.calculateNodeComplexity(node),
      },
    };
  }

  private generateNodeLabel(node: SchemaGraphNode): string {
    let label = `${node.type}`;

    if (node.constraints) {
      const constraints = [];
      if (node.constraints.format) constraints.push(node.constraints.format);
      if (node.constraints.pattern) constraints.push("pattern");
      if (node.constraints.enumValues) constraints.push("enum");
      if (constraints.length > 0) {
        label += ` (${constraints.join(", ")})`;
      }
    }

    return label;
  }

  private calculateNodeComplexity(node: SchemaGraphNode): number {
    let complexity = 1;

    if (this.isObjectNode(node)) {
      complexity += node.properties.size;
    } else if (this.isUnionNode(node)) {
      complexity += node.types.length;
    } else if (node.constraints) {
      complexity += Object.keys(node.constraints).length;
    }

    return complexity;
  }

  private isObjectNode(node: SchemaGraphNode): node is ObjectNode {
    return node.type === "object";
  }

  private isArrayNode(node: SchemaGraphNode): node is ArrayNode {
    return node.type === "array";
  }

  private isUnionNode(node: SchemaGraphNode): node is UnionNode {
    return node.type === "union";
  }

  generateMermaidDiagram(): string {
    const visualization = this.generateVisualization();
    let diagram = "graph TD\n";

    // Add nodes
    for (const node of visualization.nodes) {
      diagram += `    ${node.id}["${node.label}"]\n`;
    }

    // Add edges
    for (const edge of visualization.edges) {
      diagram += `    ${edge.from} -- "${edge.label}" --> ${edge.to}\n`;
    }

    return diagram;
  }
}
