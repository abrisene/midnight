# @acausal/types

A collection of TypeScript utility types and type helpers for enhanced type safety and development experience.

## Installation

```bash
pnpm add @acausal/types
```

## Features

### Function Types

Utility types for working with function parameters and currying:

- `Head<T>`: Extract first type from tuple
- `Tail<T>`: Extract remaining types from tuple
- `HasTail<T>`: Check if tuple has remaining elements
- `ParamRest<T>`: Extract rest parameters from function

### Object Types

Types for complex object manipulations:

- `DeepPartial<T>`: Make all properties optional recursively
- `ValueOf<T>`: Extract value types from object
- `ObjectKeys<T>`: Type-safe object keys
- `ObjectValues<T>`: Type-safe object values

### Promise Types

Types for working with async operations:

- `PromiseType<T>`: Extract type from Promise
- `AsyncReturnType<T>`: Extract return type from async function
- `AwaitedReturn<T>`: Unwrap Promise return types

### String Types

Types for string manipulation:

- `StringLiteral<T>`: Convert string to literal type
- `Split<T>`: Split string literal type
- `Join<T>`: Join string literal types

### Zod Integration

Enhanced Zod schema type utilities:

- `ZodInfer<T>`: Improved type inference
- `ZodShape<T>`: Extract shape from schema
- `ZodKeys<T>`: Extract keys from schema

## Usage Examples

See the [documentation](./docs) for detailed usage examples and advanced patterns.
