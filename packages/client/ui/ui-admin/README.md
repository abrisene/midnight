# @acausal/ui-admin

React components for building admin interfaces, with a focus on schedule management and timeline visualization.

## Installation

```bash
pnpm add @acausal/ui-admin
```

## Features

### Schedule Management

Comprehensive schedule and timeline management:

- Calendar and vector-based scheduling
- Hierarchical schedule structures
- Drag-and-drop timeline editing
- Visual timeline representation
- Nested schedule support

### Schedule Types

Two primary schedule types:

#### Calendar Schedule

- Fixed start/end times
- Date-based scheduling
- Optional end time
- Nested child schedules

#### Vector Schedule

- Offset-based timing
- Duration-based events
- Trigger event support
- Relative positioning

## Usage

### Schedule Manager

```typescript
import { ScheduleManager } from '@acausal/ui-admin';

function AdminPanel() {
  return (
    <ScheduleManager
      initialSchedules={schedules}
      onSchedulesChange={handleChange}
    />
  );
}
```

### Schedule Timeline

```typescript
import { ScheduleTimeline } from '@acausal/ui-admin';

function Timeline() {
  return (
    <ScheduleTimeline
      schedules={schedules}
      onUpdateSchedule={handleUpdate}
    />
  );
}
```

## API Reference

### Schedule Types

```typescript
interface CalendarSchedule {
  id: string;
  type: "calendar";
  name: string;
  startTime: string;
  endTime?: string;
  children: Schedule[];
}

interface VectorSchedule {
  id: string;
  type: "vector";
  name: string;
  triggerEvent?: string;
  offset?: number;
  duration: number;
  children: Schedule[];
}
```

### Component Props

```typescript
interface ScheduleManagerProps {
  initialSchedules?: Schedule[];
  onSchedulesChange?: (schedules: Schedule[]) => void;
}

interface ScheduleTimelineProps {
  schedules: Schedule[];
  onUpdateSchedule: (updatedSchedule: Schedule) => void;
}
```

## Documentation

See the [API documentation](./docs/api.md) for detailed usage information and advanced features.
