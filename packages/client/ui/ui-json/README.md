# @acausal/ui-json

React components for JSON visualization, editing, and formatting.

## Installation

```bash
pnpm add @acausal/ui-json
```

## Features

### JSON Viewer

Interactive JSON visualization with syntax highlighting and collapsible nodes:

- Tree-like visualization
- Syntax highlighting
- Collapsible sections
- Copy functionality
- Search/filter capabilities

### JSON Editor

Editable JSON interface with validation:

- Live validation
- Error highlighting
- Schema validation
- Auto-formatting
- JSON5 support

### Pretty JSON

JSON formatting and beautification component:

- Customizable indentation
- Syntax highlighting
- Line numbers
- Dark/light theme support

## Usage

### JSON Viewer

```typescript
import { JsonViewer } from '@acausal/ui-json';

function JsonDisplay() {
  const data = { /* your JSON data */ };

  return (
    <JsonViewer
      data={data}
      defaultExpanded={true}
      theme="dark"
    />
  );
}
```

### JSON Editor

```typescript
import { JsonEditor } from '@acausal/ui-json';

function EditableJson() {
  const [data, setData] = useState({});

  return (
    <JsonEditor
      value={data}
      onChange={setData}
      onError={console.error}
    />
  );
}
```

### Pretty JSON

```typescript
import { PrettyJson } from '@acausal/ui-json';

function FormattedJson() {
  return (
    <PrettyJson
      data={data}
      indentSize={2}
      showLineNumbers
    />
  );
}
```

## API Reference

### JsonViewer Props

```typescript
interface JsonViewerProps {
  data: any; // JSON data to display
  defaultExpanded?: boolean; // Initially expand all nodes
  maxDepth?: number; // Maximum nesting depth to display
  theme?: "light" | "dark"; // Color theme
  onSelect?: (path: string[]) => void; // Node selection callback
}
```

### JsonEditor Props

```typescript
interface JsonEditorProps {
  value: any; // JSON value to edit
  onChange: (value: any) => void; // Value change handler
  onError?: (error: Error) => void; // Error handler
  schema?: ZodSchema; // Optional Zod schema for validation
  readOnly?: boolean; // Disable editing
}
```

### PrettyJson Props

```typescript
interface PrettyJsonProps {
  data: any; // JSON data to format
  indentSize?: number; // Indentation size
  showLineNumbers?: boolean; // Show line numbers
  highlightLines?: number[]; // Lines to highlight
  theme?: "light" | "dark"; // Color theme
}
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
