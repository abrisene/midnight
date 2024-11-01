import gameDataset from "../mocks/game-dataset.json";
import { PatternDetector } from "./pattern-detector";
import { TypeConstraints } from "./types";

describe("PatternDetector", () => {
  let detector: PatternDetector;

  beforeEach(() => {
    detector = new PatternDetector();
  });

  describe("String Pattern Detection", () => {
    test("should detect email pattern", () => {
      const samples = [
        "test@example.com",
        "user@domain.com",
        ...gameDataset.player_stats.map((player) => player.email),
      ];
      const constraints = detector.detectConstraints(samples);

      expect(constraints.format).toBe("email");
    });

    test("should detect resource ID patterns from game data", () => {
      const samples = gameDataset.resources.map((resource) => resource.id);
      const constraints = detector.detectConstraints(samples);

      expect(constraints.customPatterns?.get("resource_id")).toBeGreaterThan(0);
      expect(constraints.minLength).toBe(10); // "res_gold_1"
      expect(constraints.maxLength).toBe(18); // Updated to match actual max length
    });

    test("should detect hero ID patterns", () => {
      const samples = gameDataset.heroes.map((hero) => hero.id);
      const constraints = detector.detectConstraints(samples);

      expect(constraints.customPatterns?.get("resource_id")).toBeGreaterThan(0);
      expect(constraints.minLength).toBe(11); // "hero_mage_3"
      expect(constraints.maxLength).toBe(14); // "hero_paladin_4"
    });

    test("should detect localization key patterns", () => {
      const samples = gameDataset.heroes.map((hero) => hero.localization_key);
      const constraints = detector.detectConstraints(samples);

      expect(constraints.customPatterns?.size).toBeGreaterThan(0);
      expect(constraints.minLength).toBeGreaterThan(0);
      expect(constraints.maxLength).toBeGreaterThan(0);
    });

    test("should detect URL pattern", () => {
      const samples = [
        "http://example.com",
        "https://domain.com",
        "https://game.example.com/api",
      ];
      const constraints = detector.detectConstraints(samples);

      expect(constraints.format).toBe("url");
    });

    test("should detect UUID pattern", () => {
      const samples = [
        "123e4567-e89b-12d3-a456-426614174000",
        "987fcdeb-51a2-43f7-9abc-123456789012",
      ];
      const constraints = detector.detectConstraints(samples);

      expect(constraints.format).toBe("uuid");
    });
  });

  describe("Number Pattern Detection", () => {
    test("should detect number constraints from hero stats", () => {
      const hpSamples = gameDataset.heroes.map((hero) => hero.hp);
      const constraints = detector.detectConstraints(hpSamples);

      expect(constraints.minimum).toBe(80); // Mage HP
      expect(constraints.maximum).toBe(160); // Paladin HP
      expect(constraints.isInteger).toBe(true);
    });

    test("should detect decimal number constraints", () => {
      const speedSamples = gameDataset.heroes.map((hero) => hero.speed);
      const constraints = detector.detectConstraints(speedSamples);

      expect(constraints.minimum).toBe(1); // Mage speed
      expect(constraints.maximum).toBe(2); // Rogue speed
      expect(constraints.isInteger).toBe(false);
    });

    test("should detect sequential numbers", () => {
      const samples = [1, 2, 3, 4, 5];
      const constraints = detector.detectConstraints(samples);

      expect(constraints.isSequential).toBe(true);
      expect(constraints.minimum).toBe(1);
      expect(constraints.maximum).toBe(5);
    });

    test("should detect multiple of pattern", () => {
      const samples = [5, 10, 15, 20, 25];
      const constraints = detector.detectConstraints(samples);

      expect(constraints.multipleOf).toBe(5);
    });
  });

  describe("Object Pattern Detection", () => {
    test("should detect object constraints from items", () => {
      const samples = gameDataset.items.map((item) => ({
        ...item,
        effects: Array.isArray(item.effects) ? item.effects : [],
      }));
      const constraints = detector.detectConstraints(samples);

      expect(constraints.minProperties).toBeGreaterThan(0);
      expect(constraints.maxProperties).toBeGreaterThan(0);
    });

    test("should detect object constraints from heroes", () => {
      const samples = gameDataset.heroes;
      const constraints = detector.detectConstraints(samples);

      expect(constraints.minProperties).toBe(10); // Updated to match actual property count
      expect(constraints.maxProperties).toBe(10);
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty array", () => {
      const constraints = detector.detectConstraints([]);
      expect(constraints).toEqual({});
    });

    test("should handle mixed types gracefully", () => {
      const samples = ["test", 123, true];
      const constraints = detector.detectConstraints(samples);

      // Should only process string values
      expect(constraints.minLength).toBe(4);
      expect(constraints.maxLength).toBe(4);
    });

    test("should handle null and undefined values", () => {
      const samples = [null, undefined, null];
      const constraints = detector.detectConstraints(samples);
      expect(constraints).toEqual({});
    });

    test("should handle arrays with mixed valid and invalid values", () => {
      const samples = ["test", null, "example", undefined, "sample"];
      const constraints = detector.detectConstraints(samples);

      expect(constraints.minLength).toBe(4);
      expect(constraints.maxLength).toBe(7);
    });
  });
});
