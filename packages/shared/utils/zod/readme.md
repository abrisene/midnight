# @acausal/utils-zod

Advanced utilities for Zod schema manipulation, code generation, and analysis.

## Installation

```bash
pnpm add @acausal/utils-zod
```

## Features

### Schema Analysis

Schema analysis and introspection:

- Schema structure analysis
- Type inference
- Constraint detection
- Pattern recognition
- Complexity metrics

### Code Generation

Comprehensive code generation tools:

- TypeScript type generation
- Zod schema generation
- Schema documentation
- Test case generation
- Validation code

### Schema Stringification

Schema to string conversion utilities:

- Pretty printing
- Custom formatting
- Import management
- Code organization
- Template generation

## Usage

### Analysis

```typescript
import { SchemaAnalyzer } from "@acausal/utils-zod";

const analyzer = new SchemaAnalyzer();
const analysis = analyzer.analyzeSchema(samples);
```

### Generation

```typescript
import { generateSchemaCode } from "@acausal/utils-zod";

const code = generateSchemaCode(schema, {
  schemaName: "UserSchema",
  useImportedZod: true,
});
```

### Stringification

```typescript
import { stringifySchema } from "@acausal/utils-zod";

const schemaString = stringifySchema(schema, {
  indentSpaces: 2,
  useImportedZod: true,
});
```

## API Reference

### Schema Generation API

```typescript
interface StringifyOptions {
  indentSpaces?: number;
  useImportedZod?: boolean;
  zodPrefix?: string;
  schemaName?: string;
}

function generateSchemaCode(
  schema: z.ZodType,
  options?: StringifyOptions,
): string;
```

### Schema Analysis API

```typescript
interface SchemaAnalysis {
  type: string;
  constraints?: TypeConstraints;
  patterns?: SchemaPattern[];
  complexity: number;
}

class SchemaAnalyzer {
  analyzeSchema(schema: z.ZodType): SchemaAnalysis;
}
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
