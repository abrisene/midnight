# @acausal/utils-zod

Extended utilities for working with Zod schemas, including validation, transformation, and code generation.

## Installation

```bash
pnpm add @acausal/utils-zod
```

## Features

### Schema Utilities

Enhanced Zod schema operations:

- Schema composition helpers
- Type inference utilities
- Validation extensions
- Schema transformation
- Custom validators

### Code Generation

Generate code from Zod schemas:

- TypeScript types
- JSON Schema
- Documentation
- Validation code
- Test cases

### Schema Analysis

Tools for understanding schema structure:

- Schema visualization
- Dependency analysis
- Coverage checking
- Complexity metrics
- Pattern detection

## API Reference

### Schema Generation

```typescript
import { generateSchemaCode } from "@acausal/utils-zod";

const code = generateSchemaCode(schema, {
  name: "UserSchema",
  format: "typescript",
});
```

### Schema Analysis

```typescript
import { analyzeSchema } from "@acausal/utils-zod";

const analysis = analyzeSchema(schema);
```

See the [API documentation](./docs/api.md) for detailed usage information.
