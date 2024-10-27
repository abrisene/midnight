// useAwareness.ts
import { useState, useEffect } from 'react';
import type { WebsocketProvider } from 'y-websocket';
import type { AwarenessState } from './types';

export const useAwareness = (wsProvider: WebsocketProvider | null) => {
  const [userCount, setUserCount] = useState(0);
  const [users, setUsers] = useState<AwarenessState[]>([]);

  useEffect(() => {
    if (!wsProvider) return;

    const handleChange = () => {
      const states = Array.from(wsProvider.awareness.getStates().values());
      setUserCount(states.length);
      setUsers(states as AwarenessState[]);
    };

    // Set initial awareness state
    wsProvider.awareness.setLocalState({
      user: {
        name: `User-${Math.floor(Math.random() * 10000)}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        id: wsProvider.doc.clientID.toString(),
      },
    });

    wsProvider.awareness.on("change", handleChange);
    handleChange(); // Initial state

    return () => {
      wsProvider.awareness.off("change", handleChange);
    };
  }, [wsProvider]);

  return { userCount, users };
};
