import type { PrettyNumberOptions } from "./prettify-number";

import { prettifyNumber } from "./prettify-number";

describe("prettifyNumber", () => {
  it("should format numbers correctly with default options", () => {
    expect(prettifyNumber(0)).toBe("0");
    expect(prettifyNumber(999)).toBe("999");
    expect(prettifyNumber(1000)).toBe("1k");
    expect(prettifyNumber(1234)).toBe("1.23k");
    expect(prettifyNumber(1000000)).toBe("1M");
    expect(prettifyNumber(1234567)).toBe("1.23M");
    expect(prettifyNumber(1000000000)).toBe("1B");
    expect(prettifyNumber(1234567890)).toBe("1.23B");
  });

  it("should respect the digits option", () => {
    const options: PrettyNumberOptions = { digits: 3 };
    expect(prettifyNumber(1234, options)).toBe("1.234k");
    expect(prettifyNumber(1234567, options)).toBe("1.235M");
  });

  it("should use custom lookup table when provided", () => {
    const customLookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "K" },
      { value: 1e6, symbol: "M" },
    ];
    const options: PrettyNumberOptions = { lookup: customLookup };
    expect(prettifyNumber(1234, options)).toBe("1.23K");
    expect(prettifyNumber(1234567, options)).toBe("1.23M");
    expect(prettifyNumber(1234567890, options)).toBe("1234.57M");
  });

  it("should handle numbers less than 1", () => {
    expect(prettifyNumber(0.123)).toBe("0.12");
    expect(prettifyNumber(0.0045)).toBe("0");
  });

  it("should handle negative numbers", () => {
    expect(prettifyNumber(-1234)).toBe("-1.23k");
    expect(prettifyNumber(-1000000)).toBe("-1M");
  });

  it("should remove trailing zeros after decimal point", () => {
    expect(prettifyNumber(1000)).toBe("1k");
    expect(prettifyNumber(1100)).toBe("1.1k");
    expect(prettifyNumber(1110)).toBe("1.11k");
  });

  it("should handle very large numbers", () => {
    expect(prettifyNumber(1e15)).toBe("1Q");
    expect(prettifyNumber(1.23e15)).toBe("1.23Q");
    expect(prettifyNumber(1e18)).toBe("1000Q");
  });
});
