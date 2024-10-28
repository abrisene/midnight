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

  detectConstraints(samples: any[]): TypeConstraints {
    if (samples.length === 0) return {};

    const type = typeof samples[0];
    switch (type) {
      case "string":
        return this.detectStringConstraints(samples as string[]);
      case "number":
        return this.detectNumberConstraints(samples as number[]);
      case "object":
        return this.detectObjectConstraints(samples);
      default:
        return {};
    }
  }

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
    if (customPatterns.size > 0) {
      constraints.customPatterns = customPatterns;
    }

    return constraints;
  }

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

  private detectObjectConstraints(samples: object[]): TypeConstraints {
    return {
      minProperties: Math.min(...samples.map((obj) => Object.keys(obj).length)),
      maxProperties: Math.max(...samples.map((obj) => Object.keys(obj).length)),
    };
  }

  private detectCustomPatterns(samples: string[]): Map<string, number> {
    const patterns = new Map<string, number>();

    // Convert samples to generalized patterns
    const generalizedPatterns = samples.map((sample) => {
      return sample
        .replace(/[A-Z]+/g, "A")
        .replace(/[a-z]+/g, "a")
        .replace(/[0-9]+/g, "9")
        .replace(/[^Aa9]+/g, (match) => `\\${match}`);
    });

    // Count pattern frequencies
    for (const pattern of generalizedPatterns) {
      patterns.set(pattern, (patterns.get(pattern) || 0) + 1);
    }

    return patterns;
  }

  private findGCD(numbers: number[]): number {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };

    return numbers.reduce((a, b) => gcd(a, b));
  }
}
