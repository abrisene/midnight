# @acausal/utils-schema

A powerful schema analysis and generation toolkit with Zod integration.

## Installation

```bash
pnpm add @acausal/utils-schema
```

## Features

### Schema Analysis

Analyze and understand complex data structures:

- Automatic schema inference
- Type detection and validation
- Optional field analysis
- Nested structure support
- Array pattern detection

### Code Generation

Generate TypeScript and Zod schemas:

- TypeScript interface generation
- Zod schema generation
- JSON Schema generation
- Documentation generation
- Custom template support

### Schema Utilities

Helper functions for schema manipulation:

- Schema composition
- Schema transformation
- Validation utilities
- Type inference
- Schema visualization

## API Reference

### SchemaAnalyzer

```typescript
import { SchemaAnalyzer } from "@acausal/utils-schema";

const analyzer = new SchemaAnalyzer();
const schema = analyzer.analyze(data);
```

### Schema Generation

```typescript
import { generateZodSchema } from "@acausal/utils-schema";

const zodSchema = generateZodSchema(schema, {
  name: "UserSchema",
  format: "ts",
});
```

See the [API documentation](./docs/api.md) for more details.
