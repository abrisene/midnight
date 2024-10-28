// src/schema-graph.spec.ts
import { SchemaGraph } from "./schema-graph";
import { ScalarNode } from "./types";

describe("SchemaGraph", () => {
  let graph: SchemaGraph;

  beforeEach(() => {
    graph = new SchemaGraph();
  });

  test("should add and retrieve a node", () => {
    const node: Omit<ScalarNode, "id" | "metadata"> = {
      type: "string",
      samples: 10,
      examples: ["example"],
    };
    const nodeId = graph.addNode(node);
    const retrievedNode = graph.getNode<ScalarNode>(nodeId);

    expect(retrievedNode).toBeDefined();
    expect(retrievedNode?.type).toBe("string");
    expect(retrievedNode?.samples).toBe(10);
    expect(retrievedNode?.examples).toEqual(["example"]);
  });

  test("should merge graphs without duplicating nodes", () => {
    const node: Omit<ScalarNode, "id" | "metadata"> = {
      type: "number",
      samples: 5,
      examples: [1, 2, 3],
    };
    const nodeId = graph.addNode(node);

    const otherGraph = new SchemaGraph();
    otherGraph.addNode(node);

    graph.merge(otherGraph);

    expect(graph.getAllNodes().length).toBe(1);
    expect(graph.getNode<ScalarNode>(nodeId)).toBeDefined();
  });
});
