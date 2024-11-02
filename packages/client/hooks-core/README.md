# @acausal/hooks-core

A comprehensive collection of React hooks for DOM interactions, state management, and UI effects.

## Installation

```bash
pnpm add @acausal/hooks-core
```

## Features

### DOM Interaction Hooks

#### Mouse & Pointer

- `useMousePosition`: Track mouse coordinates
- `useMouseParallax`: Create parallax effects
- `useHover`: Track element hover state

#### Focus & Attention

- `useFocusWithin`: Track focus within container
- `useDomAttention`: Track user attention

#### Layout & Dimensions

- `useAspectRatio`: Track element aspect ratio
- `useRect`: Get element dimensions
- `useWindowRect`: Get window dimensions
- `useResizeObserver`: Watch element resizing
- `useMutationObserver`: Watch DOM changes

### State Management

#### Debounced State

- `useDebouncedState`: State with debounce control
- `useDebouncedValue`: Value with debounce control
- `useSetState`: Object state management

#### Special State

- `useForceUpdate`: Force component updates
- `useScaledArray`: Manage scaled number arrays

### Image Processing

#### Screenshot & Capture

- `useScreenshot`: Capture DOM elements
- `useScreenshotRef`: Ref-based capture
- `useColorMatrix`: Color transformations

### Scroll & Navigation

- `useScrollToRef`: Smooth scroll to element
- `useScrollToPercentage`: Scroll to position

## Usage Examples

### Mouse Parallax

```typescript
import { useMouseParallax } from '@acausal/hooks-core';

function ParallaxElement() {
  const { style } = useMouseParallax({
    depth: 10,
    rotationStrength: 1
  });

  return <div style={style}>Content</div>;
}
```

### Screenshot Capture

```typescript
import { useScreenshotRef } from '@acausal/hooks-core';

function CaptureComponent() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { takeScreenshot } = useScreenshotRef({ ref: elementRef });

  return (
    <div ref={elementRef}>
      <button onClick={takeScreenshot}>Capture</button>
    </div>
  );
}
```

### Color Matrix

```typescript
import { useColorMatrix } from '@acausal/hooks-core';

function ColorEffect() {
  const [matrix, { setBrightness, setContrast }] = useColorMatrix();

  return (
    <div style={{ filter: matrix }}>
      <button onClick={() => setBrightness(1.2)}>Brighten</button>
      <button onClick={() => setContrast(1.5)}>Contrast</button>
    </div>
  );
}
```

## API Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
