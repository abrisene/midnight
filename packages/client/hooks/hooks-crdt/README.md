# @acausal/hooks-crdt

React hooks for real-time collaboration using Conflict-free Replicated Data Types (CRDTs) powered by Yjs.

## Installation

```bash
pnpm add @acausal/hooks-crdt
```

## Features

### Collaborative Data Types

#### Text Collaboration

- `useCollaborativeText`: Real-time text editing
- `useCollaborativeCursor`: Cursor presence
- Text formatting preservation

#### Data Structures

- `useCollaborativeMap`: Shared key-value store
- `useCollaborativeArray`: Shared array
- `useCollaborativeList`: Ordered list with drag-drop

#### Presence & Awareness

- `useCollaborativePresence`: User presence tracking
- `useAwareness`: User awareness state
- Activity status management

### Document Management

#### Core Functionality

- `useYDoc`: Yjs document management
- `useUndoManager`: Undo/redo support
- `useYjsProviderWs`: WebSocket provider

#### Provider Features

- Automatic reconnection
- Connection state management
- Error handling

## Usage Examples

### Text Editor

```typescript
import { useCollaborativeText } from '@acausal/hooks-crdt';

function Editor() {
  const { text, setText, awareness } = useCollaborativeText({
    websocketUrl: 'ws://localhost:1234',
    documentId: 'doc-1'
  });

  return (
    <textarea
      value={text}
      onChange={e => setText(e.target.value)}
    />
  );
}
```

### Presence Awareness

```typescript
import { useCollaborativePresence } from '@acausal/hooks-crdt';

function UserList() {
  const { presence } = useCollaborativePresence(wsProvider, {
    idleTimeout: 60000,
    customData: { role: 'editor' }
  });

  return (
    <div>
      {Object.entries(presence).map(([id, data]) => (
        <UserBadge
          key={id}
          status={data.status}
          lastActive={data.lastActive}
        />
      ))}
    </div>
  );
}
```

### Shared List

```typescript
import { useCollaborativeList } from '@acausal/hooks-crdt';

function TaskList() {
  const { items, addItem, moveItem } = useCollaborativeList({
    websocketUrl: 'ws://localhost:1234',
    documentId: 'tasks'
  });

  return (
    <DragDropContext onDragEnd={({ source, destination }) =>
      moveItem(source.id, destination.id)
    }>
      <List>
        {items.map(item => (
          <DraggableItem key={item.id} {...item} />
        ))}
      </List>
    </DragDropContext>
  );
}
```

## API Reference

### Document Management

```typescript
interface YDocOptions {
  documentId: string;
  initialText?: string;
}

interface WebSocketOptions {
  websocketUrl: string;
  documentId: string;
  retryAttempts?: number;
  retryDelay?: number;
}
```

### Presence Types

```typescript
interface PresenceData {
  status: "active" | "idle" | "offline";
  lastActive: number;
  customData?: Record<string, unknown>;
}
```

### List Types

```typescript
interface ListItem<T> {
  id: string;
  data: T;
  order: number;
}
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
