import { useEffect, useRef, useState } from 'react';
import { getWebsocketUrl } from './app/routingUtils';

type Props = {
  onMessage: (message: MessageEvent<any>) => void;
}

/**
 * Custom hook for handling WebSocket connection
 * @param onMessage callback on message
 * @returns connect function and socket status
 */
const useWebSocket = ({ onMessage }: Props) => {
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState(WebSocket.CLOSED);

  const connect = () => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(getWebsocketUrl());

    ws.current.onopen = () => {
      setStatus(WebSocket.OPEN);
      console.log('connected');
    };

    ws.current.onclose = () => {
      setStatus(WebSocket.CLOSED);
      console.log('disconnected');
    };

    ws.current.onerror = (err) => console.log('error', err);

    ws.current.onmessage = onMessage;
  };

  useEffect(() => {
    connect();

    // close the connection when the component unmounts
    return () => ws.current?.close();
  }, []);

  return { connect, status };
};

export default useWebSocket;
