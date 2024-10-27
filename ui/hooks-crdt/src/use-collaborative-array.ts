// hooks/useCollaborativeArray.ts
import { useState, useCallback } from "react";
import * as Y from "yjs";
import { useWebSocketProvider } from "./use-yjs-provider-ws";
import { useAwareness } from "./use-awareness";
import type { WebSocketOptions } from "./types";

export function useCollaborativeArray<T>(
  options: WebSocketOptions & { initialData?: T[] }
) {
  const [state] = useState(() => {
    const yDoc = new Y.Doc();
    const yArray = yDoc.getArray("shared-array");

    if (options.initialData) {
      yArray.insert(0, options.initialData);
    }

    return { yDoc, yArray };
  });

  const { wsProvider, status, error } = useWebSocketProvider(state.yDoc, options);
  const awareness = useAwareness(wsProvider);

  const [items, setItems] = useState<T[]>([]);

  useCallback(() => {
    const updateItems = () => {
      setItems(state.yArray.toArray() as T[]);
    };

    state.yArray.observe(updateItems);
    updateItems();

    return () => {
      state.yArray.unobserve(updateItems);
      state.yDoc.destroy();
    };
  }, [state.yArray, state.yDoc]);

  return {
    items,
    push: useCallback((item: T) => {
      state.yArray.push([item]);
    }, [state.yArray]),
    insert: useCallback((index: number, item: T) => {
      state.yArray.insert(index, [item]);
    }, [state.yArray]),
    delete: useCallback((index: number) => {
      state.yArray.delete(index, 1);
    }, [state.yArray]),
    move: useCallback((fromIndex: number, toIndex: number) => {
      const item = state.yArray.get(fromIndex);
      state.yArray.delete(fromIndex, 1);
      state.yArray.insert(toIndex, [item]);
    }, [state.yArray]),
    status,
    error,
    wsProvider,
    ...awareness,
  };
}
