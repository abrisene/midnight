# @acausal/structs-spatial

A collection of spatial data structures for efficient spatial partitioning and querying.

## Installation

```bash
pnpm add @acausal/structs-spatial
```

## Features

### Grid System

#### Basic 2D Grid

A type-safe 2D grid implementation with support for arbitrary tile types:

- Efficient tile placement and retrieval
- Position validation
- Grid traversal utilities
- Serialization support
- Optional initializer function

#### N-Dimensional Grid

A flexible grid implementation supporting arbitrary dimensions:

- Support for any number of dimensions
- Type-safe value storage and retrieval
- Efficient spatial queries
- Built-in serialization
- Validation utilities

## API Reference

### Grid<T>

**Creation:**

```typescript
const grid = new Grid<string>({ width: 10, height: 10 });
```

**Key Methods:**

- `placeTile(x, y, tile)`: Place a tile
- `getTile(x, y)`: Get a tile
- `removeTile(x, y)`: Remove a tile
- `isValidPosition(x, y)`: Check position validity
- `forEach(callback)`: Iterate over all tiles
- `findTile(predicate)`: Find a tile matching predicate

### MultiDimensionalGrid<T>

**Creation:**

```typescript
const grid3D = new MultiDimensionalGrid<string>({ dimensions: [10, 10, 10] });
```

**Key Methods:**

- `setValue(value, ...indices)`: Set a value
- `getValue(...indices)`: Get a value
- `removeValue(...indices)`: Remove a value
- `isValidPosition(...indices)`: Check position validity
- `forEach(callback)`: Iterate over all values
- `findValue(predicate)`: Find a value matching predicate
