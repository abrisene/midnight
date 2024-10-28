// src/schema-graph.ts
import { SchemaGraphNode } from "./types";

export class SchemaGraph {
  private nodes: Map<string, SchemaGraphNode> = new Map();
  private counter = 0;

  private generateId(prefix: string): string {
    this.counter++;
    return `${prefix}_${this.counter}`;
  }

  addNode<T extends SchemaGraphNode>(node: Omit<T, "id" | "metadata">): string {
    const id = this.generateId(node.type);
    /* @ts-expect-error - TODO: Properly type this based off of discriminated union. */
    this.nodes.set(id, {
      id,
      ...node,
      metadata: {
        createdAt: new Date(),
        lastUpdated: new Date(),
      },
    });
    return id;
  }

  getNode<T extends SchemaGraphNode>(id: string): T | undefined {
    return this.nodes.get(id) as T | undefined;
  }

  getAllNodes(): SchemaGraphNode[] {
    return Array.from(this.nodes.values());
  }

  merge(other: SchemaGraph): void {
    for (const node of other.getAllNodes()) {
      if (!this.hasEquivalentNode(node)) {
        this.nodes.set(node.id, node);
      }
    }
  }

  private hasEquivalentNode(node: SchemaGraphNode): boolean {
    // Implementation of node equivalence checking
    // This would compare structure and sample distributions
    return false; // Placeholder
  }

  updateNode<T extends SchemaGraphNode>(id: string, node: T): void {
    if (this.nodes.has(id)) {
      this.nodes.set(id, {
        ...node,
        metadata: {
          ...node.metadata,
          lastUpdated: new Date(),
        },
      });
    }
  }
}
