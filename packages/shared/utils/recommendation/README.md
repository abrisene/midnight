# @acausal/utils-recommendation

A TypeScript implementation of collaborative filtering and recommendation algorithms.

## Installation

```bash
pnpm add @acausal/utils-recommendation
```

## Features

### Collaborative Filtering

Implementation of user-based and item-based collaborative filtering:

- User similarity calculation
- Item similarity calculation
- Rating prediction
- Hybrid recommendations
- Customizable algorithms

### Recommendation Types

#### User-Based

Recommendations based on user similarity:

- Cosine similarity between users
- User rating normalization
- Nearest neighbor selection
- Rating prediction

#### Item-Based

Recommendations based on item similarity:

- Item-item similarity matrix
- Rating weighting
- Top-N recommendations
- Cold start handling

#### Hybrid Approach

Combined recommendations using both approaches:

- Weighted combinations
- Rank fusion
- Score normalization
- Confidence scoring

## Usage

### Basic Collaborative Filtering

```typescript
import { CollaborativeFiltering } from "@acausal/utils-recommendation";

const cf = new CollaborativeFiltering();

// Add ratings
cf.addRating({ userId: "user1", itemId: "item1", rating: 5 });
cf.addRating({ userId: "user1", itemId: "item2", rating: 3 });

// Get recommendations
const recommendations = cf.recommendItemsHybrid("user1", 5);
```

### User Similarity

```typescript
// Get similar users
const similarUsers = cf.getSimilarUsers("user1", 3);

// Get user's average rating
const avgRating = cf.getAverageRating("user1");
```

### Item Similarity

```typescript
// Get similar items
const similarItems = cf.getSimilarItems("item1", 3);

// Get item's rating by user
const rating = cf.getRating("user1", "item1");
```

## API Reference

### Rating Interface

```typescript
interface Rating {
  userId: string;
  itemId: string;
  rating: number;
}
```

### CollaborativeFiltering Class

```typescript
class CollaborativeFiltering {
  addRating(rating: Rating): void;
  getAverageRating(userId: string): number;
  getRating(userId: string, itemId: string): number;
  getSimilarUsers(userId: string, n?: number): string[];
  getSimilarItems(itemId: string, n?: number): string[];
  recommendItemsUserBased(userId: string, n?: number): string[];
  recommendItemsItemBased(userId: string, n?: number): string[];
  recommendItemsHybrid(userId: string, n?: number): string[];
}
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
