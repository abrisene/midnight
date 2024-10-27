import type { Rating } from "./collaborative-filtering";
import { CollaborativeFiltering } from "./collaborative-filtering";

describe("CollaborativeFiltering", () => {
  let cf: CollaborativeFiltering;
  let ratings: Rating[];

  beforeEach(() => {
    cf = new CollaborativeFiltering();
    ratings = [
      { userId: "u1", itemId: "i1", rating: 5 },
      { userId: "u1", itemId: "i2", rating: 3 },
      { userId: "u2", itemId: "i1", rating: 4 },
      { userId: "u2", itemId: "i3", rating: 2 },
      { userId: "u3", itemId: "i1", rating: 5 },
      { userId: "u3", itemId: "i2", rating: 4 },
      { userId: "u3", itemId: "i3", rating: 1 },
    ];
    ratings.forEach((r) => cf.addRating(r));
  });

  describe("addRating", () => {
    it("should add a new rating", () => {
      const newRating: Rating = { userId: "u4", itemId: "i4", rating: 4 };
      cf.addRating(newRating);
      expect(cf.ratings).toContainEqual(newRating);
    });
  });

  describe("getSimilarUsers", () => {
    it("should return top similar users", () => {
      const similarUsers = cf.getSimilarUsers("u1", 2);
      expect(similarUsers).toHaveLength(2);
      expect(similarUsers).toContain("u3");
    });
  });

  describe("getSimilarItems", () => {
    it("should return top similar items", () => {
      const similarItems = cf.getSimilarItems("i1", 2);
      expect(similarItems).toHaveLength(2);
      expect(similarItems).toContain("i2");
    });
  });

  describe("recommendItemsUserBased", () => {
    it("should recommend items based on user similarity", () => {
      const recommendations = cf.recommendItemsUserBased("u1", 2);
      expect(recommendations).toHaveLength(1);
      expect(recommendations).toContain("i3");
    });
  });

  describe("recommendItemsItemBased", () => {
    it("should recommend items based on item similarity", () => {
      const recommendations = cf.recommendItemsItemBased("u1", 2);
      expect(recommendations).toHaveLength(1);
      expect(recommendations).toContain("i3");
    });
  });

  describe("recommendItemsHybrid", () => {
    it("should recommend items using hybrid approach", () => {
      const recommendations = cf.recommendItemsHybrid("u1", 2);
      expect(recommendations).toHaveLength(1);
      expect(recommendations).toContain("i3");
    });
  });

  describe("edge cases", () => {
    it("should handle empty ratings", () => {
      const emptyCf = new CollaborativeFiltering();
      expect(emptyCf.recommendItemsHybrid("u1", 2)).toEqual([]);
    });

    it("should handle unknown user", () => {
      expect(cf.recommendItemsHybrid("unknownUser", 2)).toEqual([]);
    });

    it("should handle user with no ratings", () => {
      // Instead of adding a rating, we'll use a new user ID that hasn't been used
      expect(cf.recommendItemsHybrid("u5", 2)).toEqual([]);
    });
  });
});
