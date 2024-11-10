import fs from "fs/promises";
import path from "path";

import { SchemaAnalyzer } from "./schema-analyzer";
import { SchemaGraph } from "./schema-graph";
import { SchemaVisualizer } from "./schema-visualizer";
import { ArrayNode, ObjectNode, ScalarNode, UnionNode } from "./types";

describe("SchemaVisualizer", () => {
  let graph: SchemaGraph;
  let visualizer: SchemaVisualizer;
  let gameData: any;

  beforeAll(async () => {
    const gameDataPath = path.resolve(__dirname, "../mocks/game-dataset.json");
    gameData = JSON.parse(await fs.readFile(gameDataPath, "utf-8"));
  });

  beforeEach(() => {
    graph = new SchemaGraph();
    visualizer = new SchemaVisualizer(graph);
  });

  describe("generateVisualization", () => {
    test("should generate visualization for scalar node", () => {
      const nodeId = graph.addNode<ScalarNode>({
        type: "string",
        samples: 1,
        examples: ["test"],
      });

      const visualization = visualizer.generateVisualization();

      expect(visualization.nodes).toHaveLength(1);
      expect(visualization.nodes[0]).toMatchObject({
        id: nodeId,
        label: "string",
        type: "string",
        metrics: {
          samples: 1,
          complexity: 1,
        },
      });
      expect(visualization.edges).toHaveLength(0);
    });

    test("should generate visualization for object node with properties", () => {
      const stringNodeId = graph.addNode<ScalarNode>({
        type: "string",
        samples: 1,
        examples: ["test"],
      });

      const objectNodeId = graph.addNode<ObjectNode>({
        type: "object",
        properties: new Map([["name", stringNodeId]]),
        samples: 1,
      });

      const visualization = visualizer.generateVisualization();

      expect(visualization.nodes).toHaveLength(2);
      expect(visualization.edges).toHaveLength(1);
      expect(visualization.edges[0]).toMatchObject({
        from: objectNodeId,
        to: stringNodeId,
        label: "name",
        type: "property",
      });
    });

    test("should generate visualization for array node", () => {
      const numberNodeId = graph.addNode<ScalarNode>({
        type: "number",
        samples: 2,
        examples: [1, 2],
      });

      const arrayNodeId = graph.addNode<ArrayNode>({
        type: "array",
        itemType: numberNodeId,
        samples: 1,
      });

      const visualization = visualizer.generateVisualization();

      expect(visualization.nodes).toHaveLength(2);
      expect(visualization.edges).toHaveLength(1);
      expect(visualization.edges[0]).toMatchObject({
        from: arrayNodeId,
        to: numberNodeId,
        label: "items",
        type: "item",
      });
    });

    test("should generate visualization for union node", () => {
      const stringNodeId = graph.addNode<ScalarNode>({
        type: "string",
        samples: 1,
        examples: ["test"],
      });

      const numberNodeId = graph.addNode<ScalarNode>({
        type: "number",
        samples: 1,
        examples: [42],
      });

      const unionNodeId = graph.addNode<UnionNode>({
        type: "union",
        types: [stringNodeId, numberNodeId],
        samples: 2,
      });

      const visualization = visualizer.generateVisualization();

      expect(visualization.nodes).toHaveLength(3);
      expect(visualization.edges).toHaveLength(2);
      expect(visualization.edges).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            from: unionNodeId,
            to: stringNodeId,
            label: "type",
            type: "union",
          }),
          expect.objectContaining({
            from: unionNodeId,
            to: numberNodeId,
            label: "type",
            type: "union",
          }),
        ]),
      );
    });
  });

  describe("generateNodeLabel", () => {
    test("should generate label with constraints", () => {
      const nodeId = graph.addNode<ScalarNode>({
        type: "string",
        samples: 1,
        examples: ["test@example.com"],
        constraints: {
          format: "email",
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
      });

      const visualization = visualizer.generateVisualization();
      const node = visualization.nodes.find((n) => n.id === nodeId);

      expect(node?.label).toBe("string (email, pattern)");
    });

    test("should generate label for enum constraints", () => {
      const nodeId = graph.addNode<ScalarNode>({
        type: "string",
        samples: 1,
        examples: ["RED"],
        constraints: {
          enumValues: ["RED", "GREEN", "BLUE"],
        },
      });

      const visualization = visualizer.generateVisualization();
      const node = visualization.nodes.find((n) => n.id === nodeId);

      expect(node?.label).toBe("string (enum)");
    });
  });

  describe("generateMermaidDiagram", () => {
    test("should generate valid Mermaid diagram", () => {
      const stringNodeId = graph.addNode<ScalarNode>({
        type: "string",
        samples: 1,
        examples: ["test"],
      });

      const objectNodeId = graph.addNode<ObjectNode>({
        type: "object",
        properties: new Map([["name", stringNodeId]]),
        samples: 1,
      });

      const diagram = visualizer.generateMermaidDiagram();

      expect(diagram).toContain("graph TD");
      expect(diagram).toContain(`${stringNodeId}["string"]`);
      expect(diagram).toContain(`${objectNodeId}["object"]`);
      expect(diagram).toContain(
        `${objectNodeId} -- "name" --> ${stringNodeId}`,
      );
    });
  });

  describe("calculateNodeComplexity", () => {
    test("should calculate complexity for object node", () => {
      const stringNodeId = graph.addNode<ScalarNode>({
        type: "string",
        samples: 1,
        examples: ["test"],
      });

      const objectNodeId = graph.addNode<ObjectNode>({
        type: "object",
        properties: new Map([
          ["name", stringNodeId],
          ["title", stringNodeId],
        ]),
        samples: 1,
      });

      const visualization = visualizer.generateVisualization();
      const node = visualization.nodes.find((n) => n.id === objectNodeId);

      expect(node?.metrics.complexity).toBe(3); // 1 base + 2 properties
    });

    test("should calculate complexity for union node", () => {
      const unionNodeId = graph.addNode<UnionNode>({
        type: "union",
        types: ["type1", "type2", "type3"],
        samples: 1,
      });

      const visualization = visualizer.generateVisualization();
      const node = visualization.nodes.find((n) => n.id === unionNodeId);

      expect(node?.metrics.complexity).toBe(4); // 1 base + 3 types
    });

    test("should calculate complexity with constraints", () => {
      const nodeId = graph.addNode<ScalarNode>({
        type: "string",
        samples: 1,
        examples: ["test"],
        constraints: {
          minLength: 1,
          maxLength: 10,
          pattern: /\w+/,
        },
      });

      const visualization = visualizer.generateVisualization();
      const node = visualization.nodes.find((n) => n.id === nodeId);

      expect(node?.metrics.complexity).toBe(4); // 1 base + 3 constraints
    });
  });

  describe("game dataset visualization", () => {
    beforeEach(() => {
      const analyzer = new SchemaAnalyzer();
      analyzer.analyze(gameData);
      graph = analyzer["graph"];
      visualizer = new SchemaVisualizer(graph);
    });

    test("should generate visualization for game dataset", () => {
      const visualization = visualizer.generateVisualization();

      // Test root level structures
      expect(visualization.nodes).toContainEqual(
        expect.objectContaining({
          label: expect.stringContaining("object"),
          metrics: expect.objectContaining({
            complexity: expect.any(Number),
          }),
        }),
      );

      // Test relationships
      const resourcesEdge = visualization.edges.find(
        (edge) => edge.label === "resources",
      );
      expect(resourcesEdge).toBeDefined();
      expect(resourcesEdge?.type).toBe("property");

      const heroesEdge = visualization.edges.find(
        (edge) => edge.label === "heroes",
      );
      expect(heroesEdge).toBeDefined();
      expect(heroesEdge?.type).toBe("property");
    });

    test("should generate valid Mermaid diagram for game dataset", () => {
      const diagram = visualizer.generateMermaidDiagram();

      expect(diagram).toContain("graph TD");
      // Test for key relationships
      expect(diagram).toMatch(/-- "resources" -->/);
      expect(diagram).toMatch(/-- "heroes" -->/);
      expect(diagram).toMatch(/-- "items" -->/);
    });

    test("should identify complex nested structures", () => {
      const visualization = visualizer.generateVisualization();

      // Find nodes with high complexity
      const complexNodes = visualization.nodes.filter(
        (node) => node.metrics.complexity > 5,
      );

      expect(complexNodes.length).toBeGreaterThan(0);
      expect(complexNodes[0]?.metrics.complexity).toBeGreaterThan(5);
    });

    /* test("should detect common patterns in game data", () => {
      const visualization = visualizer.generateVisualization();

      // Find nodes with specific patterns
      const idNodes = visualization.nodes.filter((node) =>
        node.label.includes("(pattern)"),
      );
      expect(idNodes.length).toBeGreaterThan(0);

      // Test for enum detection
      const enumNodes = visualization.nodes.filter((node) =>
        node.label.includes("(enum)"),
      );
      expect(enumNodes.length).toBeGreaterThan(0);
    }); */
  });
});
