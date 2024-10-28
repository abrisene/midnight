// src/schema-comparator.ts
import { SchemaGraph } from "./schema-graph";
import {
  ArrayNode,
  ObjectNode,
  SchemaGraphNode,
  TypeConstraints,
} from "./types";

export interface SchemaDiff {
  added: Set<string>;
  removed: Set<string>;
  modified: Map<
    string,
    {
      before: SchemaGraphNode;
      after: SchemaGraphNode;
      changes: string[];
    }
  >;
  compatibility: "compatible" | "breaking" | "partial";
}

export class SchemaComparator {
  compare(before: SchemaGraph, after: SchemaGraph): SchemaDiff {
    const diff: SchemaDiff = {
      added: new Set(),
      removed: new Set(),
      modified: new Map(),
      compatibility: "compatible",
    };

    // Find added and modified nodes
    for (const node of after.getAllNodes()) {
      const beforeNode = before.getNode(node.id);
      if (!beforeNode) {
        diff.added.add(node.id);
      } else {
        // Fix: Compare node properties more thoroughly
        const changes = this.compareNodes(beforeNode, node);
        if (changes.length > 0) {
          diff.modified.set(node.id, {
            before: beforeNode,
            after: node,
            changes,
          });
        }
      }
    }

    // Find removed nodes
    for (const node of before.getAllNodes()) {
      if (!after.getNode(node.id)) {
        diff.removed.add(node.id);
      }
    }

    // Determine compatibility
    diff.compatibility = this.determineCompatibility(diff);

    return diff;
  }

  private compareNodes(
    before: SchemaGraphNode,
    after: SchemaGraphNode,
  ): string[] {
    const changes: string[] = [];

    // Fix: Compare all relevant properties
    if (before.type !== after.type) {
      changes.push(`type changed from ${before.type} to ${after.type}`);
    }
    if (before.samples !== after.samples) {
      changes.push(
        `samples changed from ${before.samples} to ${after.samples}`,
      );
    }
    if (before.optional !== after.optional) {
      changes.push(
        `optionality changed from ${before.optional} to ${after.optional}`,
      );
    }

    if (this.isObjectNode(before) && this.isObjectNode(after)) {
      this.compareObjectNodes(before, after, changes);
    } else if (this.isArrayNode(before) && this.isArrayNode(after)) {
      if (before.itemType !== after.itemType) {
        changes.push(
          `array item type changed from ${before.itemType} to ${after.itemType}`,
        );
      }
    }

    this.compareConstraints(before.constraints, after.constraints, changes);

    return changes;
  }

  private compareObjectNodes(
    before: ObjectNode,
    after: ObjectNode,
    changes: string[],
  ) {
    // Compare properties
    const beforeProps = Array.from(before.properties.keys());
    const afterProps = Array.from(after.properties.keys());

    const added = afterProps.filter((prop) => !beforeProps.includes(prop));
    const removed = beforeProps.filter((prop) => !afterProps.includes(prop));

    if (added.length > 0) {
      changes.push(`added properties: ${added.join(", ")}`);
    }
    if (removed.length > 0) {
      changes.push(`removed properties: ${removed.join(", ")}`);
    }
  }

  private compareConstraints(
    before?: TypeConstraints,
    after?: TypeConstraints,
    changes: string[] = [],
  ) {
    if (!before || !after) return changes;

    for (const key of Object.keys(before) as Array<keyof TypeConstraints>) {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changes.push(
          `constraint ${key} changed from ${before[key]} to ${after[key]}`,
        );
      }
    }

    return changes;
  }

  private determineCompatibility(
    diff: SchemaDiff,
  ): "compatible" | "breaking" | "partial" {
    // Breaking changes:
    // 1. Removed required properties
    // 2. Changed type of existing properties
    // 3. Made optional properties required

    const hasBreakingChanges = Array.from(diff.modified.values()).some(
      ({ changes }) =>
        changes.some(
          (change) =>
            change.includes("type changed") ||
            change.includes("optionality changed") ||
            change.includes("removed properties"),
        ),
    );

    if (hasBreakingChanges || diff.removed.size > 0) {
      return "breaking";
    }

    if (diff.modified.size > 0 || diff.added.size > 0) {
      return "partial";
    }

    return "compatible";
  }

  private isObjectNode(node: SchemaGraphNode): node is ObjectNode {
    return node.type === "object";
  }

  private isArrayNode(node: SchemaGraphNode): node is ArrayNode {
    return node.type === "array";
  }
}
