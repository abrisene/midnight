// useCollaborativeText.ts
import type { WebsocketProvider } from "y-websocket";
import { useCallback } from "react";
import { useY } from "react-yjs";
import { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";

import type { WebSocketOptions, YDocOptions } from "./types";

import { useAwareness } from "./use-awareness";
import { useUndoManager } from "./use-undo-manager";
import { useYDoc } from "./use-ydoc";
import { useWebSocketProvider } from "./use-yjs-provider-ws";

// Define the return type for useCollaborativeText
interface CollaborativeTextResult {
  text: string;
  status: "connecting" | "connected" | "disconnected";
  error: Error | null;
  userCount: number;
  users: Map<number, any>;
  onChange: (value: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  cleanup: () => void;
  wsProvider: WebsocketProvider;
}

export const useCollaborativeText = ({
  websocketUrl,
  documentId,
  initialText = "",
  retryAttempts,
  retryDelay,
}: WebSocketOptions & YDocOptions): CollaborativeTextResult => {
  const { yDoc, text: yText, cleanup } = useYDoc({ documentId, initialText });
  const { wsProvider, status, error } = useWebSocketProvider(yDoc, {
    websocketUrl,
    documentId,
    retryAttempts,
    retryDelay,
  });
  const { userCount, users } = useAwareness(wsProvider);
  const { undo, redo, canUndo, canRedo } = useUndoManager(yText);
  const textDisplay = useY(yText);

  const onChange = useCallback(
    (value: string) => {
      yText.delete(0, yText.length);
      yText.insert(0, value);
    },
    [yText],
  );

  return {
    text: textDisplay.toString(),
    status,
    error,
    userCount,
    users,
    onChange,
    undo,
    redo,
    canUndo,
    canRedo,
    cleanup,
    wsProvider: wsProvider,
  };
};
