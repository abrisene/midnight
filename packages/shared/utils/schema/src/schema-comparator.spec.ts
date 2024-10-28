import { SchemaComparator } from "./schema-comparator";
import { SchemaGraph } from "./schema-graph";
import { ScalarNode } from "./types";

describe("SchemaComparator", () => {
  let comparator: SchemaComparator;
  let beforeGraph: SchemaGraph;
  let afterGraph: SchemaGraph;

  beforeEach(() => {
    comparator = new SchemaComparator();
    beforeGraph = new SchemaGraph();
    afterGraph = new SchemaGraph();
  });

  test("should detect added nodes", () => {
    const node: Omit<ScalarNode, "id" | "metadata"> = {
      type: "string",
      samples: 10,
      examples: ["example"],
    };
    afterGraph.addNode(node);

    const diff = comparator.compare(beforeGraph, afterGraph);
    expect(diff.added.size).toBe(1);
    expect(diff.removed.size).toBe(0);
    expect(diff.modified.size).toBe(0);
  });

  test("should detect removed nodes", () => {
    const node: Omit<ScalarNode, "id" | "metadata"> = {
      type: "string",
      samples: 10,
      examples: ["example"],
    };
    const nodeId = beforeGraph.addNode(node);

    const diff = comparator.compare(beforeGraph, afterGraph);
    expect(diff.added.size).toBe(0);
    expect(diff.removed.has(nodeId)).toBe(true);
    expect(diff.modified.size).toBe(0);
  });

  test("should detect modified nodes", () => {
    const node: Omit<ScalarNode, "id" | "metadata"> = {
      type: "string",
      samples: 10,
      examples: ["example"],
    };
    const nodeId = beforeGraph.addNode(node);

    const modifiedNode: Omit<ScalarNode, "id" | "metadata"> = {
      ...node,
      samples: 20,
    };
    afterGraph.addNode(modifiedNode);

    const diff = comparator.compare(beforeGraph, afterGraph);
    expect(diff.added.size).toBe(0);
    expect(diff.removed.size).toBe(0);
    expect(diff.modified.has(nodeId)).toBe(true);
  });

  test("should determine compatibility", () => {
    const node: Omit<ScalarNode, "id" | "metadata"> = {
      type: "string",
      samples: 10,
      examples: ["example"],
    };
    beforeGraph.addNode(node);

    const modifiedNode: Omit<ScalarNode, "id" | "metadata"> = {
      ...node,
      type: "number",
    };
    afterGraph.addNode(modifiedNode);

    const diff = comparator.compare(beforeGraph, afterGraph);
    expect(diff.compatibility).toBe("breaking");
  });
});
