import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react";

export interface IWebSocketContext<T> {
  connected: boolean;
  sendMessage: (msg: string) => void;
  lastMessage: T | null;
  setLastMessage: Dispatch<SetStateAction<T | null>>;
}

export const WebSocketContext = createContext<IWebSocketContext<any>>(null!);

interface Props<T> {
  url: string;
  children: React.ReactNode;
}

export function WebSocketProvider<T = unknown>({ url, children }: Props<T>) {
  const socketRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<T | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      setConnected(true);
      socket.send(JSON.stringify({ event: "status" }));
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      setConnected(false);
      console.log("WebSocket disconnected");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    return () => {
      socket.close();
    };
  }, [url]);

  const sendMessage = (msg: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    }
  };

  const contextValue = useMemo(
    () => ({
      connected,
      sendMessage,
      lastMessage,
      setLastMessage,
     
    }),
    [connected, lastMessage]
  );

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
}
