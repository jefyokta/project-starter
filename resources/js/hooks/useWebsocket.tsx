import { useContext } from "react";
import { WebSocketContext, IWebSocketContext } from "../context/websocket";

export function useWebSocket<T = unknown>(): IWebSocketContext<T> {
  return useContext(WebSocketContext) as IWebSocketContext<T>;
}
