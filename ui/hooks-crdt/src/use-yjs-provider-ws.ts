// useWebSocketProvider.ts
import { useState, useEffect, useCallback } from 'react';
import { WebsocketProvider } from 'y-websocket';
import { ConnectionStatus, WebSocketOptions } from "./types";
import * as Y from "yjs";

export const useWebSocketProvider = (
  yDoc: Y.Doc,
  { websocketUrl, documentId, retryAttempts = 3, retryDelay = 1000 }: WebSocketOptions
) => {
  const [wsProvider, setWsProvider] = useState<WebsocketProvider | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>('connecting');
  const [error, setError] = useState<Error | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);

  const connect = useCallback(() => {
    try {
      const provider = new WebsocketProvider(websocketUrl, documentId, yDoc);
      setWsProvider(provider);
      setError(null);
      return provider;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  }, [websocketUrl, documentId, yDoc]);

  useEffect(() => {
    let provider = connect();
    let retryTimeout: NodeJS.Timeout;

    const handleDisconnect = () => {
      if (attemptCount < retryAttempts) {
        retryTimeout = setTimeout(() => {
          setAttemptCount(prev => prev + 1);
          provider = connect();
        }, retryDelay);
      }
    };

    if (provider) {
      provider.on('status', ({ status }: { status: ConnectionStatus }) => {
        setStatus(status);
        if (status === 'disconnected') {
          handleDisconnect();
        }
      });
    }

    return () => {
      clearTimeout(retryTimeout);
      provider?.destroy();
    };
  }, [connect, attemptCount, retryAttempts, retryDelay]);

  return { wsProvider, status, error };
};
