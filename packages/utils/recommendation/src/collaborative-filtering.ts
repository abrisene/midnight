export interface Rating {
  userId: string;
  itemId: string;
  rating: number;
}

export class CollaborativeFiltering {
  private ratings: Rating[] = [];

  // Add a new rating
  addRating(rating: Rating) {
    this.ratings.push(rating);
  }

  // Get the average rating for a specific user
  private getAverageRating(userId: string): number {
    const userRatings = this.ratings.filter((r) => r.userId === userId);
    if (userRatings.length === 0) return 0;
    const sum = userRatings.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / userRatings.length;
  }

  // Get rating by user and item
  private getRating(userId: string, itemId: string): number {
    const rating = this.ratings.find(
      (r) => r.userId === userId && r.itemId === itemId,
    );
    return rating ? rating.rating : 0;
  }

  // Get list of items rated by a specific user
  private getItemsRatedByUser(userId: string): string[] {
    return this.ratings.filter((r) => r.userId === userId).map((r) => r.itemId);
  }

  // Get list of users who have rated a specific item
  private getUsersWhoRatedItem(itemId: string): string[] {
    return this.ratings.filter((r) => r.itemId === itemId).map((r) => r.userId);
  }

  // Calculate the cosine similarity between two users
  private calculateUserSimilarity(userA: string, userB: string): number {
    const itemsA = this.getItemsRatedByUser(userA);
    const itemsB = this.getItemsRatedByUser(userB);

    const commonItems = itemsA.filter((item) => itemsB.includes(item));
    if (commonItems.length === 0) return 0;

    const dotProduct = commonItems.reduce((acc, item) => {
      return acc + this.getRating(userA, item) * this.getRating(userB, item);
    }, 0);

    const magnitudeA = Math.sqrt(
      itemsA.reduce(
        (acc, item) => acc + Math.pow(this.getRating(userA, item), 2),
        0,
      ),
    );
    const magnitudeB = Math.sqrt(
      itemsB.reduce(
        (acc, item) => acc + Math.pow(this.getRating(userB, item), 2),
        0,
      ),
    );

    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Calculate the cosine similarity between two items
  private calculateItemSimilarity(itemA: string, itemB: string): number {
    const usersA = this.getUsersWhoRatedItem(itemA);
    const usersB = this.getUsersWhoRatedItem(itemB);

    const commonUsers = usersA.filter((user) => usersB.includes(user));
    if (commonUsers.length === 0) return 0;

    const dotProduct = commonUsers.reduce((acc, user) => {
      return acc + this.getRating(user, itemA) * this.getRating(user, itemB);
    }, 0);

    const magnitudeA = Math.sqrt(
      usersA.reduce(
        (acc, user) => acc + Math.pow(this.getRating(user, itemA), 2),
        0,
      ),
    );
    const magnitudeB = Math.sqrt(
      usersB.reduce(
        (acc, user) => acc + Math.pow(this.getRating(user, itemB), 2),
        0,
      ),
    );

    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Get top similar users to the target user
  getSimilarUsers(targetUserId: string, topN = 3): string[] {
    const allUsers = Array.from(new Set(this.ratings.map((r) => r.userId)));
    const similarities = allUsers
      .filter((userId) => userId !== targetUserId)
      .map((userId) => ({
        userId,
        similarity: this.calculateUserSimilarity(targetUserId, userId),
      }))
      .sort((a, b) => b.similarity - a.similarity);

    return similarities.slice(0, topN).map((s) => s.userId);
  }

  // Get top similar items to the target item
  getSimilarItems(targetItemId: string, topN = 3): string[] {
    const allItems = Array.from(new Set(this.ratings.map((r) => r.itemId)));
    const similarities = allItems
      .filter((itemId) => itemId !== targetItemId)
      .map((itemId) => ({
        itemId,
        similarity: this.calculateItemSimilarity(targetItemId, itemId),
      }))
      .sort((a, b) => b.similarity - a.similarity);

    return similarities.slice(0, topN).map((s) => s.itemId);
  }

  // Recommend items to a user based on other similar users (User-based filtering)
  recommendItemsUserBased(userId: string, topN = 3): string[] {
    const userRatings = this.getItemsRatedByUser(userId);

    // If the user has no ratings or is unknown, return an empty array
    if (userRatings.length === 0) {
      return [];
    }

    const similarUsers = this.getSimilarUsers(userId);
    const recommendedItems: Record<string, number> = {};

    similarUsers.forEach((similarUserId) => {
      const items = this.getItemsRatedByUser(similarUserId);
      items.forEach((itemId) => {
        if (!this.getItemsRatedByUser(userId).includes(itemId)) {
          if (!recommendedItems[itemId]) recommendedItems[itemId] = 0;
          recommendedItems[itemId] += this.getRating(similarUserId, itemId);
        }
      });
    });

    return Object.keys(recommendedItems)
      .sort((a, b) => (recommendedItems[b] ?? 0) - (recommendedItems[a] ?? 0))
      .slice(0, topN);
  }

  // Recommend items to a user based on similar items they have liked (Item-based filtering)
  recommendItemsItemBased(userId: string, topN = 3): string[] {
    const itemsRatedByUser = this.getItemsRatedByUser(userId);

    // If the user has no ratings or is unknown, return an empty array
    if (itemsRatedByUser.length === 0) {
      return [];
    }

    const recommendedItems: Record<string, number> = {};

    itemsRatedByUser.forEach((itemId) => {
      const similarItems = this.getSimilarItems(itemId);
      similarItems.forEach((similarItemId) => {
        if (!itemsRatedByUser.includes(similarItemId)) {
          if (!recommendedItems[similarItemId])
            recommendedItems[similarItemId] = 0;
          recommendedItems[similarItemId] += this.getRating(userId, itemId);
        }
      });
    });

    return Object.keys(recommendedItems)
      .sort((a, b) => (recommendedItems[b] ?? 0) - (recommendedItems[a] ?? 0))
      .slice(0, topN);
  }

  // Hybrid recommendation combining user-based and item-based filtering
  recommendItemsHybrid(userId: string, topN = 3): string[] {
    const userRatings = this.getItemsRatedByUser(userId);

    // If the user has no ratings or is unknown, return an empty array
    if (userRatings.length === 0) {
      return [];
    }

    const userBasedRecommendations = this.recommendItemsUserBased(
      userId,
      topN * 2,
    );
    const itemBasedRecommendations = this.recommendItemsItemBased(
      userId,
      topN * 2,
    );

    // If both recommendation methods return empty arrays, return an empty array
    if (
      userBasedRecommendations.length === 0 &&
      itemBasedRecommendations.length === 0
    ) {
      return [];
    }

    const combinedRecommendations: Record<string, number> = {};

    userBasedRecommendations.forEach((itemId) => {
      if (!combinedRecommendations[itemId]) combinedRecommendations[itemId] = 0;
      combinedRecommendations[itemId] += 1;
    });

    itemBasedRecommendations.forEach((itemId) => {
      if (!combinedRecommendations[itemId]) combinedRecommendations[itemId] = 0;
      combinedRecommendations[itemId] += 1;
    });

    return Object.keys(combinedRecommendations)
      .sort(
        (a, b) =>
          (combinedRecommendations[b] ?? 0) - (combinedRecommendations[a] ?? 0),
      )
      .slice(0, topN);
  }
}
