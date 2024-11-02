# @acausal/utils-image

A TypeScript utility package for image type detection and manipulation.

## Installation

```bash
pnpm add @acausal/utils-image
```

## Features

### MIME Type Detection

Accurate image format detection:

- Binary signature detection
- Multiple format support
- Type-safe results
- Buffer handling
- Zod schema integration

### Supported Formats

Detection for common image formats:

- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

## Usage

### MIME Type Detection

```typescript
import { detectImageMimeType } from '@acausal/utils-image';

// Detect from buffer
const buffer = new Uint8Array([...]);
const mimeType = detectImageMimeType(buffer);
// Returns: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'image/svg+xml' | undefined
```

### With Zod Schema

```typescript
import { ImageMimeType } from "@acausal/utils-image";

const schema = z.object({
  image: ImageMimeType,
});

// Validates and transforms image data
const result = schema.parse({
  image: imageBuffer,
});
```

## API Reference

### MIME Type Detection

```typescript
function detectImageMimeType(
  image: Uint8Array,
):
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml"
  | undefined;
```

### Zod Schema

```typescript
const ImageMimeType: z.ZodType<string>;
```

### Supported Signatures

```typescript
const mimeTypeSignatures = [
  { mimeType: "image/gif", bytes: [0x47, 0x49, 0x46] },
  { mimeType: "image/png", bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mimeType: "image/jpeg", bytes: [0xff, 0xd8] },
  { mimeType: "image/webp", bytes: [0x52, 0x49, 0x46, 0x46] },
];
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
