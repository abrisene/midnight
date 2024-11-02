# @acausal/utils-logger

A flexible logging utility built on Pino with enhanced serialization and formatting.

## Installation

```bash
pnpm add @acausal/utils-logger
```

## Features

### Core Logging

Comprehensive logging capabilities:

- Multiple log levels
- Structured logging
- Context preservation
- Pretty printing
- Custom formatters

### Serialization

Advanced data serialization:

- Error serialization
- Request/Response serialization
- Custom serializers
- Circular reference handling
- Binary data handling

### Context Management

Rich contextual logging:

- Child loggers
- Request tracking
- User context
- Service context
- Environment awareness

## Usage

### Basic Logging

```typescript
import { createLogger } from "@acausal/utils-logger";

const logger = createLogger({
  name: "my-app",
  level: "info",
});

logger.info("Hello world");
logger.error({ err }, "Something went wrong");
```

### With Context

```typescript
const requestLogger = logger.child({
  requestId: "123",
  userId: "user-456",
  service: "auth",
});

requestLogger.info("Processing request");
```

### Pretty Printing

```typescript
const devLogger = createLogger({
  prettify: true,
  level: "debug",
});

devLogger.debug({ data }, "Debug information");
```

## API Reference

### Logger Options

```typescript
interface LoggerOptions {
  level?: LogLevel;
  name?: string;
  prettify?: boolean;
}

type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";
```

### Log Context

```typescript
interface LogContext {
  requestId?: string;
  userId?: string;
  service?: string;
  environment?: string;
  [key: string]: unknown;
}
```

### Serializers

```typescript
const errorSerializer: SerializerFn;
const requestSerializer: SerializerFn;
const responseSerializer: SerializerFn;
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
