# @acausal/utils-promise

A TypeScript utility package for advanced promise handling with exponential backoff and retry logic.

## Installation

```bash
pnpm add @acausal/utils-promise
```

## Features

### Exponential Backoff

Robust retry mechanism with exponential backoff:

- Configurable retry attempts
- Exponential delay increase
- Custom backoff factors
- Progress tracking
- Named retries

### Error Handling

Comprehensive error management:

- Error preservation
- Retry counting
- Custom error handlers
- Progress callbacks
- Timeout support

## Usage

### Basic Retry

```typescript
import { backoff } from "@acausal/utils-promise";

const result = await backoff(async () => fetchData(), {
  maxRetries: 3,
  backoff: 1000, // Start with 1s delay
});
```

### Custom Backoff Strategy

```typescript
const result = await backoff(async () => fetchData(), {
  backoff: 100,
  maxRetries: 5,
  backoffFactor: 2,
  name: "DataFetch",
  onRetry: (retry, delay, name) => {
    console.log(`${name}: Retry ${retry} after ${delay}ms`);
  },
});
```

### With Progress Tracking

```typescript
const result = await backoff(async () => uploadFile(), {
  maxRetries: 3,
  backoff: 1000,
  onRetry: (retry, delay) => {
    updateProgress(`Retrying... (${retry}/3)`);
  },
});
```

## API Reference

### Backoff Options

```typescript
interface BackoffOptions {
  backoff?: number; // Initial backoff delay in ms
  maxRetries?: number; // Maximum retry attempts
  backoffFactor?: number; // Multiplier for each retry
  name?: string; // Operation name for logging
  onRetry?: (
    // Retry callback
    retry: number, // Current retry count
    backoff: number, // Current backoff delay
    name?: string, // Operation name
  ) => void;
}
```

### Default Values

```typescript
const DEFAULT_BACKOFF = 50; // 50ms initial delay
const DEFAULT_MAX_RETRIES = 10; // 10 retry attempts
const DEFAULT_BACKOFF_FACTOR = 1; // Linear backoff
```

### Backoff Function

```typescript
function backoff<T>(
  promise: () => Promise<T>,
  options?: BackoffOptions,
): Promise<T>;
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
