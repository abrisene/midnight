import {
  camelToSnakeCase,
  camelToTitleCase,
  isCamelCase,
  isSnakeCase,
  snakeToCamelCase,
  toCamelCase,
  toTitleCase,
} from "./string-casing";

describe("String Casing Functions", () => {
  describe("toTitleCase", () => {
    it("should convert strings to title case", () => {
      expect(toTitleCase("hello world")).toBe("Hello World");
      expect(toTitleCase("HELLO WORLD")).toBe("Hello World");
      expect(toTitleCase("hello WORLD")).toBe("Hello World");
    });
  });

  describe("toCamelCase", () => {
    it("should convert strings to camel case", () => {
      expect(toCamelCase("hello world")).toBe("helloWorld");
      expect(toCamelCase("Hello World")).toBe("helloWorld");
      expect(toCamelCase("HELLO WORLD")).toBe("helloWorld");
    });
  });

  describe("camelToTitleCase", () => {
    it("should convert camel case to title case", () => {
      expect(camelToTitleCase("helloWorld")).toBe("Hello World");
      expect(camelToTitleCase("myVariableName")).toBe("My Variable Name");
    });
  });

  describe("camelToSnakeCase", () => {
    it("should convert camel case to snake case", () => {
      expect(camelToSnakeCase("helloWorld")).toBe("hello_world");
      expect(camelToSnakeCase("myVariableName")).toBe("my_variable_name");
    });
  });

  describe("isCamelCase", () => {
    it("should correctly identify camel case strings", () => {
      expect(isCamelCase("helloWorld")).toBe(true);
      expect(isCamelCase("myVariableName")).toBe(true);
      expect(isCamelCase("hello_world")).toBe(false);
      expect(isCamelCase("hello World")).toBe(false);
      expect(isCamelCase("HelloWorld")).toBe(false);
    });
  });

  describe("snakeToCamelCase", () => {
    it("should convert snake case to camel case", () => {
      expect(snakeToCamelCase("hello_world")).toBe("helloWorld");
      expect(snakeToCamelCase("my_variable_name")).toBe("myVariableName");
    });
  });

  describe("isSnakeCase", () => {
    it("should correctly identify snake case strings", () => {
      expect(isSnakeCase("hello_world")).toBe(true);
      expect(isSnakeCase("my_variable_name")).toBe(true);
      expect(isSnakeCase("helloWorld")).toBe(false);
      expect(isSnakeCase("hello")).toBe(true);
      expect(isSnakeCase("hello world")).toBe(false);
    });
  });
});
