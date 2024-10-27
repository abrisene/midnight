// types.ts
import type * as Y from "yjs";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

export interface YDocOptions {
  documentId: string;
  initialText?: string;
}

export interface WebSocketOptions {
  websocketUrl: string;
  documentId: string;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface AwarenessState {
  user: {
    name: string;
    color: string;
    id: string;
    cursor?: { index: number; length: number };
  };
}

export interface UndoManagerState {
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export type UseUndoManager = (yText: Y.Text) => UndoManagerState;
