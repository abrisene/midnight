// src/pattern-detector.ts
import { TypeConstraints } from "./types";

export class PatternDetector {
  private static readonly PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    URL: /^https?:\/\/\S+$/,
    DATE_ISO: /^\d{4}-\d{2}-\d{2}$/,
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    TIMESTAMP: /^\d{10}$|^\d{13}$/,
    CREDIT_CARD: /^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/,
    PHONE: /^\+?[\d\s-]{10,}$/,
    ZIP_CODE: /^\d{5}(-\d{4})?$/,
  };

  /**
   * Detects constraints from an array of samples.
   * @param samples - The array of samples to detect constraints from.
   * @returns The detected constraints.
   */
  detectConstraints(samples: any[]): TypeConstraints {
    if (samples.length === 0 || samples.every((s) => s == null)) return {};

    const type = typeof samples[0];
    switch (type) {
      case "string":
        return this.detectStringConstraints(
          samples.filter((s) => typeof s === "string"),
        );
      case "number":
        return this.detectNumberConstraints(
          samples.filter((s) => typeof s === "number"),
        );
      case "object":
        return this.detectObjectConstraints(
          samples.filter((s) => s && typeof s === "object"),
        );
      default:
        return {};
    }
  }

  /**
   * Detects string constraints from an array of samples.
   * @param samples - The array of samples to detect string constraints from.
   * @returns The detected string constraints.
   */
  private detectStringConstraints(samples: string[]): TypeConstraints {
    const constraints: TypeConstraints = {
      minLength: Math.min(...samples.map((s) => s.length)),
      maxLength: Math.max(...samples.map((s) => s.length)),
      customPatterns: new Map(),
    };

    // Detect common patterns
    for (const [name, pattern] of Object.entries(PatternDetector.PATTERNS)) {
      const matches = samples.filter((s) => pattern.test(s));
      if (matches.length / samples.length > 0.8) {
        constraints.format = name.toLowerCase() as any;
      }
    }

    // Detect custom patterns
    const customPatterns = this.detectCustomPatterns(samples);
    const totalSamples = samples.length;

    // Only keep patterns that match a significant portion of samples
    const significantPatterns = new Map<string, number>();
    for (const [pattern, count] of customPatterns.entries()) {
      if (count / totalSamples >= 0.8) {
        // 80% threshold
        significantPatterns.set(pattern, count);
      }
    }

    if (significantPatterns.size > 0) {
      constraints.customPatterns = significantPatterns;
    }

    return constraints;
  }

  /**
   * Detects number constraints from an array of samples.
   * @param samples - The array of samples to detect number constraints from.
   * @returns The detected number constraints.
   */
  private detectNumberConstraints(samples: number[]): TypeConstraints {
    const constraints: TypeConstraints = {
      minimum: Math.min(...samples),
      maximum: Math.max(...samples),
      isInteger: samples.every((n) => Number.isInteger(n)),
    };

    // Detect if numbers are multiples of a common value
    const gcd = this.findGCD(samples);
    if (gcd > 1) {
      constraints.multipleOf = gcd;
    }

    // Detect if numbers are sequential
    const isSequential = samples.every((n, i, arr) => {
      return i === 0 || n === (arr[i - 1] as number) + 1;
    });

    if (isSequential) {
      constraints.isSequential = true;
    }

    // Detect if numbers are ascending or descending
    const isAscending = samples.every((n, i, arr) => {
      return i === 0 || n === (arr[i - 1] as number) + 1;
    });

    const isDescending = samples.every((n, i, arr) => {
      return i === 0 || n === (arr[i - 1] as number) - 1;
    });

    return constraints;
  }

  /**
   * Detects object constraints from an array of samples.
   * @param samples - The array of samples to detect object constraints from.
   * @returns The detected object constraints.
   */
  private detectObjectConstraints(samples: object[]): TypeConstraints {
    if (samples.length === 0) return {};

    return {
      minProperties: Math.min(...samples.map((obj) => Object.keys(obj).length)),
      maxProperties: Math.max(...samples.map((obj) => Object.keys(obj).length)),
    };
  }

  /**
   * Detects custom patterns from an array of samples.
   * @param samples - The array of samples to detect custom patterns from.
   * @returns A map of patterns to their counts.
   */
  private detectCustomPatterns(samples: string[]): Map<string, number> {
    const patterns = new Map<string, number>();

    // Convert samples to generalized patterns
    const generalizedPatterns = samples.map((sample) => {
      if (typeof sample !== "string") return "";

      // More specific pattern detection
      if (sample.match(/^[A-Z_]+$/)) return "ENUM"; // Enum-like
      if (sample.match(/^[a-z]+_[a-z]+_\d+$/)) return "resource_id"; // resource_type_number
      if (sample.match(/^[A-Z]{3}_\d{3}$/)) return "code_id"; // ABC_123
      if (sample.includes("@")) return "email"; // Email-like

      // Generic pattern detection as fallback
      return sample
        .replace(/[A-Z]+/g, "A")
        .replace(/[a-z]+/g, "a")
        .replace(/[0-9]+/g, "9")
        .replace(/[^Aa9]+/g, (match) => `\\${match}`);
    });

    // Count pattern frequencies
    for (const pattern of generalizedPatterns) {
      if (pattern) {
        patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
      }
    }

    return patterns;
  }

  /**
   * Finds the greatest common divisor of an array of numbers.
   * @param numbers - The array of numbers to find the greatest common divisor of.
   * @returns The greatest common divisor.
   */
  private findGCD(numbers: number[]): number {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };

    return numbers.reduce((a, b) => gcd(a, b));
  }
}
