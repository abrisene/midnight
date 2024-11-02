# @acausal/utils-json

A comprehensive JSON utility package for parsing, beautifying, and transforming JSON with TypeScript support.

## Installation

```bash
pnpm add @acausal/utils-json
```

## Features

### JSON Beautification

Format JSON with customizable indentation and spacing:

- Pretty-print JSON with custom formatting
- Configurable indentation levels
- Optional sorting of object keys
- Preserve comments (optional)

### JSON Parsing

Robust JSON parsing with error handling:

- Partial JSON parsing support
- Detailed error messages
- Recovery from common syntax errors
- Stream parsing capabilities

### JSON Schema Integration

Zod schema integration for JSON validation:

- Convert JSON Schema to Zod schemas
- Generate JSON Schema from Zod definitions
- Validate JSON against schemas
- Type inference from schemas

### Deep Equality

Efficient deep equality checking for JSON structures:

- Customizable comparison options
- Handling of circular references
- Array order sensitivity options
- Special value handling (NaN, undefined)

## Usage

```typescript
import { beautifyJSON } from "@acausal/utils-json/beautify";
import { deepEqual } from "@acausal/utils-json/deep-equal";
import { parsePartialJSON } from "@acausal/utils-json/parse-partial";
```

## API Reference

See the [API documentation](./docs/api.md) for detailed usage examples.
