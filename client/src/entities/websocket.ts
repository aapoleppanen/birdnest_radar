import { useEffect, useRef, useState } from 'react';
import { getWebsocketUrl } from './app/routingUtils';

type Props = {
  onMessage: (message: MessageEvent<any>) => void;
}

const useWebSocket = ({ onMessage }: Props) => {
  const ws = useRef<WebSocket | null>(null);
  const [status, setStatus] = useState(WebSocket.CLOSED);

  useEffect(() => {
    connect();

    return () => ws.current?.close();
  }, []);

  const connect = () => {
    console.log('connect called');
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

  return { connect, status };
};

export default useWebSocket;
