# @acausal/utils-http

A TypeScript HTTP client with built-in Zod validation and type safety.

## Installation

```bash
pnpm add @acausal/utils-http
```

## Features

### Type-Safe Fetching

Strongly typed HTTP requests:

- Zod schema validation
- Type inference
- Runtime type checking
- Error handling
- Response parsing

### Request Configuration

Flexible request configuration:

- Base URL support
- Default options
- Header management
- Option merging
- Callback hooks

### Response Handling

Comprehensive response processing:

- JSON parsing
- Validation
- Error handling
- Success callbacks
- Type coercion

## Usage

### Basic Fetching

```typescript
import { fetcher } from "@acausal/utils-http";
import { z } from "zod";

const api = fetcher("https://api.example.com");

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const user = await api("/users/1", {}, UserSchema);
//    ^ typed as { id: number, name: string }
```

### With Default Options

```typescript
const api = fetcher("https://api.example.com", {
  headers: {
    Authorization: "Bearer token",
  },
});

const response = await api(
  "/protected",
  {
    method: "POST",
    body: JSON.stringify(data),
  },
  ResponseSchema,
);
```

### With Callbacks

```typescript
const api = fetcher("https://api.example.com", {}, () =>
  console.log("Request completed"),
);

const data = await api("/endpoint", {}, Schema);
```

## API Reference

### Fetcher Factory

```typescript
function fetcher(
  baseURL: URL | string,
  defaultOptions?: RequestInit,
  callback?: () => void,
): <V extends ZodType>(
  route: string,
  options?: RequestInit,
  validator: V,
) => Promise<z.infer<V>>;
```

### Request Options

```typescript
interface RequestInit {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  // ... other fetch options
}
```

### Default Headers

```typescript
{
  "Content-Type": "application/json",
  "accept": "application/json"
}
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
