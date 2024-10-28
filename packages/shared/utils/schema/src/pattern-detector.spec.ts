import { PatternDetector } from "./pattern-detector";
import { TypeConstraints } from "./types";

describe("PatternDetector", () => {
  let detector: PatternDetector;

  beforeEach(() => {
    detector = new PatternDetector();
  });

  test("should detect email pattern", () => {
    const samples = ["test@example.com", "user@domain.com"];
    const constraints = detector.detectConstraints(samples);

    expect(constraints.format).toBe("email");
  });

  test("should detect URL pattern", () => {
    const samples = ["http://example.com", "https://domain.com"];
    const constraints = detector.detectConstraints(samples);

    expect(constraints.format).toBe("url");
  });

  test("should detect custom patterns", () => {
    const samples = ["abc123", "def456"];
    const constraints = detector.detectConstraints(samples);

    expect(constraints.customPatterns?.size).toBeGreaterThan(0);
  });

  test("should detect number constraints", () => {
    const samples = [1, 2, 3, 4, 5];
    const constraints = detector.detectConstraints(samples);

    expect(constraints.minimum).toBe(1);
    expect(constraints.maximum).toBe(5);
    expect(constraints.isInteger).toBe(true);
  });
});
