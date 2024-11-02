# @acausal/utils-common

A collection of essential utility functions for string manipulation, array operations, and number formatting.

## Installation

```bash
pnpm add @acausal/utils-common
```

## Features

### String Utilities

#### Case Conversion

- `toTitleCase`: Convert to Title Case
- `toCamelCase`: Convert to camelCase
- `camelToTitleCase`: camelCase to Title Case
- `camelToSnakeCase`: camelCase to snake_case
- `snakeToCamelCase`: snake_case to camelCase

#### Case Detection

- `isCamelCase`: Check for camelCase
- `isSnakeCase`: Check for snake_case

#### Template Utilities

- `generateLabelTagFunction`: Create template tag functions
- Template string formatting
- Label and separator management

### Number Utilities

#### Number Formatting

- `prettifyNumber`: Format numbers with suffixes (1k, 1M, etc.)
- Customizable digit precision
- Custom suffix lookup tables
- Negative number handling
- Decimal formatting

### Array Utilities

#### Array Operations

- `mergeArraysUnique`: Merge and deduplicate arrays
- `coerceArray`: Coerce values to arrays
- `filterNullish`: Remove null/undefined values
- `chunkArray`: Split arrays into chunks
- `shuffleArray`: Randomize array elements
- `lastN`: Get last N elements
- `flattenDeep`: Flatten nested arrays

## Usage

### String Manipulation

```typescript
import { toCamelCase, toTitleCase } from "@acausal/utils-common/string";

const camelCase = toCamelCase("hello world"); // 'helloWorld'
const titleCase = toTitleCase("hello world"); // 'Hello World'
```

### Number Formatting

```typescript
import { prettifyNumber } from "@acausal/utils-common/number";

prettifyNumber(1234); // '1.23k'
prettifyNumber(1000000); // '1M'
```

### Array Operations

```typescript
import {
  chunkArray,
  mergeArraysUnique,
  shuffleArray,
} from "@acausal/utils-common/array";

chunkArray([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
mergeArraysUnique([1, 2], [2, 3]); // [1, 2, 3]
shuffleArray([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4]
```

## API Reference

### String Functions

```typescript
function toTitleCase(str: string): string;
function toCamelCase(str: string): string;
function camelToSnakeCase(str: string): string;
function snakeToCamelCase(str: string): string;
function generateLabelTagFunction(
  prefix: string,
  separator: string,
  suffix?: string,
): TemplateTag;
```

### Number Functions

```typescript
interface PrettyNumberOptions {
  digits?: number;
  lookup?: { value: number; symbol: string }[];
}

function prettifyNumber(num: number, options?: PrettyNumberOptions): string;
```

### Array Functions

```typescript
function mergeArraysUnique<T>(...arrays: T[][]): T[];
function coerceArray<T>(value: T | T[]): T[];
function chunkArray<T>(array: T[], size: number): T[][];
function shuffleArray<T>(array: T[]): T[];
function lastN<T>(array: T[], n: number): T[];
function flattenDeep<T>(arr: (T | T[])[]): T[];
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
