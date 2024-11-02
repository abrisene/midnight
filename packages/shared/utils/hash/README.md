# @acausal/utils-hash

A TypeScript utility package for consistent hashing with multiple algorithm support.

## Installation

```bash
pnpm add @acausal/utils-hash
```

## Features

### Hash Algorithms

Multiple hashing algorithm support:

- XXHash32 (fast, non-cryptographic)
- MD5
- Custom hasher support
- WebAssembly acceleration
- Configurable seeds

### Schema Hashing

Advanced schema hashing capabilities:

- Object structure hashing
- Order-independent hashing
- Nested object support
- Undefined value handling
- Custom hasher integration

### Hash Factory

Flexible hash function creation:

- Configurable hash algorithms
- Seed management
- Promise-based API
- Type-safe results
- Performance optimization

## Usage

### Basic Hashing

```typescript
import { HASHER_MD5, HASHER_XXHASH } from "@acausal/utils-hash";

// Using XXHash
const xxhash = await HASHER_XXHASH;
const hash1 = xxhash("data");

// Using MD5
const md5hash = await HASHER_MD5;
const hash2 = md5hash("data");
```

### Schema Hashing

```typescript
import { SCHEMA_HASHER } from "@acausal/utils-hash";

const schema = {
  name: "test",
  nested: {
    value: 123,
  },
};

const hash = await SCHEMA_HASHER(schema);
```

### Custom Hasher

```typescript
import { createSchemaHasher, createXXHasher } from "@acausal/utils-hash";

// Create custom XXHasher with seed
const hasher = await createXXHasher(12345);

// Create schema hasher with custom hasher
const schemaHasher = createSchemaHasher(hasher);
const hash = await schemaHasher(data);
```

## API Reference

### Hash Factories

```typescript
function createXXHasher(seed: number): Promise<(data: unknown) => string>;
function createMD5Hasher(): Promise<(data: unknown) => string>;
```

### Schema Hashing

```typescript
function hashSchemaWithHasher(
  hasher?: Awaitable<(input: string) => string>,
  properties: Record<string, any>,
): Promise<string>;

function createSchemaHasher(
  hasher: Awaitable<(input: string) => string>,
): (properties: Record<string, any>) => Promise<string>;
```

### Default Hashers

```typescript
const HASHER_XXHASH: Promise<(data: unknown) => string>;
const HASHER_MD5: Promise<(data: unknown) => string>;
const SCHEMA_HASHER: (properties: Record<string, any>) => Promise<string>;
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
