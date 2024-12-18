// hooks/useCollaborativeMap.ts
import { useCallback, useState } from "react";
import * as Y from "yjs";

import type { WebSocketOptions } from "./types";

import { useAwareness } from "./use-awareness";
import { useWebSocketProvider } from "./use-yjs-provider-ws";

export function useCollaborativeMap<T extends object>(
  options: WebSocketOptions & { initialData?: T },
) {
  const [state] = useState(() => {
    const yDoc = new Y.Doc();
    const yMap = yDoc.getMap("shared-map");

    if (options.initialData) {
      Object.entries(options.initialData).forEach(([key, value]) => {
        yMap.set(key, value);
      });
    }

    return { yDoc, yMap };
  });

  const { wsProvider, status, error } = useWebSocketProvider(
    state.yDoc,
    options,
  );
  const awareness = useAwareness(wsProvider);

  const [data, setData] = useState<T>({} as T);

  useCallback(() => {
    const updateData = () => {
      const newData = Object.fromEntries(state.yMap.entries());
      setData(newData as T);
    };

    state.yMap.observe(updateData);
    updateData();

    return () => {
      state.yMap.unobserve(updateData);
      state.yDoc.destroy();
    };
  }, [state.yMap, state.yDoc]);

  const set = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      state.yMap.set(key as string, value);
    },
    [state.yMap],
  );

  const delete_ = useCallback(
    <K extends keyof T>(key: K) => {
      state.yMap.delete(key as string);
    },
    [state.yMap],
  );

  return {
    data,
    set,
    delete: delete_,
    status,
    error,
    wsProvider,
    ...awareness,
  };
}
