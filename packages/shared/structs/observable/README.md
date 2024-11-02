# @atelier/structs-observable

A lightweight, type-safe implementation of the Observer pattern for TypeScript applications.

## Installation

```bash
pnpm add @atelier/structs-observable
```

## Features

### Simple Observable

A basic implementation of the Observer pattern without state:

- Subscribe to value updates
- Unsubscribe to prevent memory leaks
- Optional debug labels
- Type-safe value emission

### Stateful Observable

A stateful implementation that maintains and broadcasts its current value:

- Maintains current state
- Immediate state access on subscription
- Type-safe state updates
- Optional debug labels

## API Reference

### SimpleObservable<T>

**Creation:**

```typescript
const observable = new SimpleObservable<string>();
```

**Key Methods:**

- `subscribe(fn)`: Subscribe to updates
- `next(data)`: Emit a new value
- `debugLabel`: Optional label for debugging

### StatefulObservable<T>

**Creation:**

```typescript
const state = new StatefulObservable<number>(0);
```

**Key Methods:**

- `subscribe(fn)`: Subscribe to updates
- `get()`: Get current value
- `set(data)`: Update current value
- `debugLabel`: Optional label for debugging
