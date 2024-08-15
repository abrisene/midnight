import { fixJson } from "./fix-json";

test("should handle empty input", () => {
  expect(fixJson("")).toEqual("");
});

describe("literals", () => {
  test("should handle incomplete null", () => {
    expect(fixJson("nul")).toEqual("null");
  });

  test("should handle incomplete true", () => {
    expect(fixJson("t")).toEqual("true");
  });

  test("should handle incomplete false", () => {
    expect(fixJson("fals")).toEqual("false");
  });
});

describe("number", () => {
  test("should handle incomplete numbers", () => {
    expect(fixJson("12.")).toEqual("12");
  });

  test("should handle numbers with dot", () => {
    expect(fixJson("12.2")).toEqual("12.2");
  });

  test("should handle negative numbers", () => {
    expect(fixJson("-12")).toEqual("-12");
  });

  test("should handle incomplete negative numbers", () => {
    expect(fixJson("-")).toEqual("");
  });

  test("should handle e-notation numbers", () => {
    expect(fixJson("2.5e")).toEqual("2.5");
    expect(fixJson("2.5e-")).toEqual("2.5");
    expect(fixJson("2.5e3")).toEqual("2.5e3");
    expect(fixJson("-2.5e3")).toEqual("-2.5e3");
  });

  test("should handle uppercase e-notation numbers", () => {
    expect(fixJson("2.5E")).toEqual("2.5");
    expect(fixJson("2.5E-")).toEqual("2.5");
    expect(fixJson("2.5E3")).toEqual("2.5E3");
    expect(fixJson("-2.5E3")).toEqual("-2.5E3");
  });

  test("should handle incomplete numbers", () => {
    expect(fixJson("12.e")).toEqual("12");
    expect(fixJson("12.34e")).toEqual("12.34");
    expect(fixJson("5e")).toEqual("5");
  });
});

describe("string", () => {
  test("should handle incomplete strings", () => {
    expect(fixJson('"abc')).toEqual('"abc"');
  });

  test("should handle escape sequences", () => {
    expect(fixJson('"value with \\"quoted\\" text and \\\\ escape')).toEqual(
      '"value with \\"quoted\\" text and \\\\ escape"',
    );
  });

  test("should handle incomplete escape sequences", () => {
    expect(fixJson('"value with \\')).toEqual('"value with "');
  });

  test("should handle unicode characters", () => {
    expect(fixJson('"value with unicode \u003C"')).toEqual(
      '"value with unicode \u003C"',
    );
  });
});

describe("array", () => {
  test("should handle incomplete array", () => {
    expect(fixJson("[")).toEqual("[]");
  });

  test("should handle closing bracket after number in array", () => {
    expect(fixJson("[[1], [2")).toEqual("[[1], [2]]");
  });

  test("should handle closing bracket after string in array", () => {
    expect(fixJson(`[["1"], ["2`)).toEqual(`[["1"], ["2"]]`);
  });

  test("should handle closing bracket after literal in array", () => {
    expect(fixJson("[[false], [nu")).toEqual("[[false], [null]]");
  });

  test("should handle closing bracket after array in array", () => {
    expect(fixJson("[[[]], [[]")).toEqual("[[[]], [[]]]");
  });

  test("should handle closing bracket after object in array", () => {
    expect(fixJson("[[{}], [{")).toEqual("[[{}], [{}]]");
  });

  test("should handle trailing comma", () => {
    expect(fixJson("[1, ")).toEqual("[1]");
  });

  test("should handle closing array", () => {
    expect(fixJson("[[], 123")).toEqual("[[], 123]");
  });
});

describe("object", () => {
  test("should handle keys without values", () => {
    expect(fixJson('{"key":')).toEqual("{}");
  });

  test("should handle closing brace after number in object", () => {
    expect(fixJson('{"a": {"b": 1}, "c": {"d": 2')).toEqual(
      '{"a": {"b": 1}, "c": {"d": 2}}',
    );
  });

  test("should handle closing brace after string in object", () => {
    expect(fixJson('{"a": {"b": "1"}, "c": {"d": 2')).toEqual(
      '{"a": {"b": "1"}, "c": {"d": 2}}',
    );
  });

  test("should handle closing brace after literal in object", () => {
    expect(fixJson('{"a": {"b": false}, "c": {"d": 2')).toEqual(
      '{"a": {"b": false}, "c": {"d": 2}}',
    );
  });

  test("should handle closing brace after array in object", () => {
    expect(fixJson('{"a": {"b": []}, "c": {"d": 2')).toEqual(
      '{"a": {"b": []}, "c": {"d": 2}}',
    );
  });

  test("should handle closing brace after object in object", () => {
    expect(fixJson('{"a": {"b": {}}, "c": {"d": 2')).toEqual(
      '{"a": {"b": {}}, "c": {"d": 2}}',
    );
  });

  test("should handle partial keys (first key)", () => {
    expect(fixJson('{"ke')).toEqual("{}");
  });

  test("should handle partial keys (second key)", () => {
    expect(fixJson('{"k1": 1, "k2')).toEqual('{"k1": 1}');
  });

  test("should handle partial keys with colon (second key)", () => {
    expect(fixJson('{"k1": 1, "k2":')).toEqual('{"k1": 1}');
  });

  test("should handle trailing whitespace", () => {
    expect(fixJson('{"key": "value"  ')).toEqual('{"key": "value"}');
  });

  test("should handle closing after empty object", () => {
    expect(fixJson('{"a": {"b": {}')).toEqual('{"a": {"b": {}}}');
  });
});

describe("nesting", () => {
  test("should handle nested arrays with numbers", () => {
    expect(fixJson("[1, [2, 3, [")).toEqual("[1, [2, 3, []]]");
  });

  test("should handle nested arrays with literals", () => {
    expect(fixJson("[false, [true, [")).toEqual("[false, [true, []]]");
  });

  test("should handle nested objects", () => {
    expect(fixJson('{"key": {"subKey":')).toEqual('{"key": {}}');
  });

  test("should handle nested objects with numbers", () => {
    expect(fixJson('{"key": 123, "key2": {"subKey":')).toEqual(
      '{"key": 123, "key2": {}}',
    );
  });

  test("should handle nested objects with literals", () => {
    expect(fixJson('{"key": null, "key2": {"subKey":')).toEqual(
      '{"key": null, "key2": {}}',
    );
  });

  test("should handle arrays within objects", () => {
    expect(fixJson('{"key": [1, 2, {')).toEqual('{"key": [1, 2, {}]}');
  });

  test("should handle objects within arrays", () => {
    expect(fixJson('[1, 2, {"key": "value",')).toEqual(
      '[1, 2, {"key": "value"}]',
    );
  });

  test("should handle nested arrays and objects", () => {
    expect(fixJson('{"a": {"b": ["c", {"d": "e",')).toEqual(
      '{"a": {"b": ["c", {"d": "e"}]}}',
    );
  });

  test("should handle deeply nested objects", () => {
    expect(fixJson('{"a": {"b": {"c": {"d":')).toEqual(
      '{"a": {"b": {"c": {}}}}',
    );
  });

  test("should handle potential nested arrays or objects", () => {
    expect(fixJson('{"a": 1, "b": [')).toEqual('{"a": 1, "b": []}');
    expect(fixJson('{"a": 1, "b": {')).toEqual('{"a": 1, "b": {}}');
    expect(fixJson('{"a": 1, "b": "')).toEqual('{"a": 1, "b": ""}');
  });
});

describe("regression", () => {
  test("should handle complex nesting 1", () => {
    expect(
      fixJson(
        [
          "{",
          '  "a": [',
          "    {",
          '      "a1": "v1",',
          '      "a2": "v2",',
          `      "a3": "v3"`,
          "    }",
          "  ],",
          '  "b": [',
          "    {",
          '      "b1": "n',
        ].join("\n"),
      ),
    ).toEqual(
      [
        "{",
        '  "a": [',
        "    {",
        '      "a1": "v1",',
        '      "a2": "v2",',
        `      "a3": "v3"`,
        "    }",
        "  ],",
        '  "b": [',
        "    {",
        '      "b1": "n"}]}',
      ].join("\n"),
    );
  });

  test("should handle empty objects inside nested objects and arrays", () => {
    expect(
      fixJson(`{"type":"div","children":[{"type":"Card","props":{}`),
    ).toEqual(`{"type":"div","children":[{"type":"Card","props":{}}]}`);
  });
});
