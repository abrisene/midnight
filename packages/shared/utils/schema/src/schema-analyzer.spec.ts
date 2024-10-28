import { SchemaAnalyzer } from "./schema-analyzer";
import { ArrayNode, ObjectNode, ScalarNode, UnionNode } from "./types";

describe("SchemaAnalyzer", () => {
  let analyzer: SchemaAnalyzer;

  beforeEach(() => {
    analyzer = new SchemaAnalyzer();
  });

  test("should infer schema for scalar types", () => {
    const samples = [1, 2, 3];
    const nodeId = analyzer.analyze(samples);
    const node = analyzer["graph"].getNode<ScalarNode>(nodeId);

    expect(node).toBeDefined();
    expect(node?.type).toBe("number");
    expect(node?.samples).toBe(3);
  });

  test("should infer schema for object types", () => {
    const samples = [{ a: 1 }, { a: 2 }];
    const nodeId = analyzer.analyze(samples);
    const node = analyzer["graph"].getNode<ObjectNode>(nodeId);

    expect(node).toBeDefined();
    expect(node?.type).toBe("object");
    expect(node?.properties.size).toBe(1);
    expect(node?.properties.get("a")).toBeDefined();
  });

  test("should infer schema for array types", () => {
    const samples = [
      [1, 2],
      [3, 4],
    ];
    const nodeId = analyzer.analyze(samples);
    const node = analyzer["graph"].getNode<ArrayNode>(nodeId);

    expect(node).toBeDefined();
    expect(node?.type).toBe("array");
    expect(node?.samples).toBe(2);
  });

  test("should infer schema for union types", () => {
    const samples = [1, "string", null];
    const nodeId = analyzer.analyze(samples);
    const node = analyzer["graph"].getNode<UnionNode>(nodeId);

    expect(node).toBeDefined();
    expect(node?.type).toBe("union");
    expect(node?.types.length).toBe(3);
  });

  test("should handle optional fields", () => {
    const samples = [{ a: 1 }, {}];
    const nodeId = analyzer.analyze(samples);
    const node = analyzer["graph"].getNode<ObjectNode>(nodeId);

    expect(node).toBeDefined();
    expect(node?.type).toBe("object");
    expect(node?.properties.size).toBe(1);
    const propertyNode = analyzer["graph"].getNode<ScalarNode>(
      node?.properties.get("a")!,
    );
    expect(propertyNode?.optional).toBe(true);
  });
});
