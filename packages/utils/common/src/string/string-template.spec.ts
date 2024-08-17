import { generateLabelTagFunction } from "./string-template";

describe("generateLabelTagFunction", () => {
  it("should create a tag function that prepends a label and separator", () => {
    const botTag = generateLabelTagFunction("{BOT}", ": ");
    expect(botTag`Hello, how are you?`).toBe("{BOT}: Hello, how are you?");
  });

  it("should handle interpolation correctly", () => {
    const userTag = generateLabelTagFunction("{USER}", ": ");
    const name = "Alice";
    expect(userTag`My name is ${name}.`).toBe("{USER}: My name is Alice.");
  });

  it("should work with empty strings", () => {
    const emptyTag = generateLabelTagFunction("EMPTY", "->");
    expect(emptyTag``).toBe("EMPTY->");
  });

  it("should handle multiple interpolations", () => {
    const multiTag = generateLabelTagFunction("MULTI", " | ");
    const a = 1,
      b = 2,
      c = 3;
    expect(multiTag`${a} + ${b} = ${c}`).toBe("MULTI | 1 + 2 = 3");
  });

  it("should work with custom suffix", () => {
    const customTag = generateLabelTagFunction("<start>", " ", "<end>");
    expect(customTag`Hello`).toBe("<start> Hello<end>");
  });
});
