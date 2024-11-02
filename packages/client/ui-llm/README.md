# @acausal/ui-llm

React components for building LLM-powered interfaces, with a focus on prompt chain management and UI context tracking.

## Installation

```bash
pnpm add @acausal/ui-llm
```

## Features

### Prompt Chain Editor

Visual editor for creating and managing LLM prompt chains:

- Multi-step prompt sequences
- Variable interpolation
- Context-aware prompts
- Response previews
- Chain visualization

### UI Context Tracking

System for capturing and managing UI interaction context:

- Hover state tracking
- Interaction history
- Contextual data extraction
- Threshold-based hover detection
- Parent-child context inheritance

## Usage

### Prompt Chain Editor

```typescript
import { PromptChainEditor } from '@acausal/ui-llm';

function PromptEditor() {
  return (
    <PromptChainEditor />
  );
}
```

### UI Context Tracking

```typescript
import { useContextualData } from '@acausal/ui-llm';

function ContextAwareComponent() {
  const { currentData, history, eventHandlers } = useContextualData({
    type: 'initial',
    data: null
  });

  return (
    <div {...eventHandlers}>
      {/* Your component content */}
    </div>
  );
}
```

## API Reference

### Prompt Chain Types

```typescript
interface PromptStep {
  id: number;
  key: string;
  name: string;
  content: string;
  previewResponse: string;
}

interface PromptChain {
  name: string;
  description: string;
  steps: PromptStep[];
}
```

### Context Tracking Types

```typescript
interface ContextualData {
  type: string;
  data: any;
}

interface ContextualDataHistory {
  timestamp: number;
  data: ContextualData;
  interactionType: string;
}
```

### Hook Options

```typescript
interface UseContextualDataOptions {
  initialData?: ContextualData;
  maxHistoryLength?: number;
  hoverThreshold?: number;
}
```
