# @acausal/utils-api

A TypeScript utility for creating strongly-typed API client wrappers with built-in connection management and error handling.

## Installation

```bash
pnpm add @acausal/utils-api
```

## Features

### Base API Wrapper

Abstract base class for building type-safe API clients:

- Connection state management
- Automatic reconnection
- Error handling
- Request queueing
- Progress tracking

### Type Safety

Full TypeScript integration:

- Generic type constraints
- Request/response typing
- Error type definitions
- Connection state types
- Progress event types

### Connection Management

Built-in connection handling:

- Connection state tracking
- Automatic reconnection
- Configurable retry logic
- Connection event hooks
- Health checks

## Use Cases

### REST API Client

```typescript
import { BaseAPIWrapper } from "@acausal/utils-api/http";

class ProductAPI extends BaseAPIWrapper {
  constructor(config: APIConfig) {
    super(config);
  }

  async getProducts(): Promise<Product[]> {
    return this.get("/products");
  }

  async createProduct(product: CreateProductDTO): Promise<Product> {
    return this.post("/products", product);
  }
}

const api = new ProductAPI({
  baseURL: "https://api.example.com",
  connectOnInit: true,
});
```

### WebSocket Client

```typescript
class WebSocketAPI extends BaseAPIWrapper {
  private ws: WebSocket;

  async connect() {
    this.ws = new WebSocket(this.config.url);
    this.ws.onmessage = this.handleMessage;
    await this.waitForOpen();
  }

  async disconnect() {
    this.ws.close();
  }

  private handleMessage = (event: MessageEvent) => {
    this.processResponse(JSON.parse(event.data));
  };
}
```

### GraphQL Client

```typescript
class GraphQLAPI extends BaseAPIWrapper {
  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    return this.post("/graphql", {
      query,
      variables,
    });
  }

  async mutation<T>(
    mutation: string,
    variables?: Record<string, any>,
  ): Promise<T> {
    return this.post("/graphql", {
      query: mutation,
      variables,
    });
  }
}
```

## API Reference

### BaseAPIWrapper

```typescript
abstract class BaseAPIWrapper {
  constructor(config: APIConfig);

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;

  protected async execute<T>(task: () => Promise<T>): Promise<T>;
  protected onConnectionChange(state: ConnectionState): void;
  protected onError(error: Error): void;
}
```

### Configuration

```typescript
interface APIConfig {
  baseURL: string;
  headers?: Record<string, string>;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  connectOnInit?: boolean;
  onConnectionChange?: (state: ConnectionState) => void;
  onError?: (error: Error) => void;
}
```

### Connection States

```typescript
type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "error";
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
