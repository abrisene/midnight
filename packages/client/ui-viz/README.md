# @acausal/ui-viz

React components for curve visualization and editing, featuring a powerful Bezier curve editor and SVG utilities.

## Installation

```bash
pnpm add @acausal/ui-viz
```

## Features

### Bezier Curve Editor

Interactive curve editing and visualization:

- Multiple curve types support
- Point manipulation
- Real-time curve updates
- Customizable styling
- D3-based curve generation

### Curve Types

Support for various D3 curve interpolation types:

- Linear & Linear Closed
- Basis (Normal, Closed, Open)
- Cardinal (Normal, Closed, Open)
- Catmull-Rom (Normal, Closed, Open)
- Monotone (X, Y)
- Natural
- Step (Normal, Before, After)

### SVG Components

Low-level SVG utilities:

- SVG Viewer
- Bezier Path
- Interactive Handles
- Path Generation

## Usage

### Basic Curve Editor

```typescript
import { BezierCurveEditor } from '@acausal/ui-viz';

function CurveEditor() {
  return (
    <BezierCurveEditor
      strokeColor="stroke-red-500"
      handleColor="transparent"
      lineWidth={2}
      handleRadius={8}
      onCurvesChange={handleChange}
    />
  );
}
```

### Curve Manager

```typescript
import { BezierCurvesManager } from '@acausal/ui-viz';

function CurveManager() {
  return (
    <BezierCurvesManager
      onCurveCreated={handleCreate}
      onCurveDeleted={handleDelete}
      onCurvesChanged={handleChange}
    />
  );
}
```

### Custom Curve Path

```typescript
import { BezierCurvePath } from '@acausal/ui-viz';

function CustomCurve() {
  return (
    <BezierCurvePath
      curve={curveData}
      width={width}
      height={height}
      onAddPoint={handleAddPoint}
    />
  );
}
```

## API Reference

### BezierCurveEditor Props

```typescript
interface BezierCurveEditorProps {
  strokeColor?: string; // Curve stroke color
  handleColor?: string; // Handle point color
  lineWidth?: number; // Curve line width
  handleRadius?: number; // Handle point radius
  onCurvesChange?: (curves: BezierCurve[]) => void;
  onAddPoint?: (curveId: string, x: number, y: number) => void;
}
```

### BezierCurve Type

```typescript
interface BezierCurve {
  id: string; // Unique curve identifier
  points: [number, number][]; // Array of control points
  clampEnds?: boolean; // Clamp end points to edges
  color?: string; // Curve color
  className?: string; // Additional CSS classes
  type?: CurveType; // D3 curve interpolation type
}
```

### Curve Types

```typescript
type CurveType =
  | "linear"
  | "linear-closed"
  | "basis"
  | "basis-closed"
  | "basis-open"
  | "cardinal"
  | "cardinal-closed"
  | "cardinal-open"
  | "catmull-rom"
  | "catmull-rom-closed"
  | "catmull-rom-open"
  | "monotone-x"
  | "monotone-y"
  | "natural"
  | "step"
  | "step-after"
  | "step-before";
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
