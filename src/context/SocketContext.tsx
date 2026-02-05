"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";
import { SOCKET_EVENTS } from "@/constants/socket-events";

// Type definition for the Context state
type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

// Custom hook to use the socket anywhere in your components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Initialize the server-side socket by hitting the API route
    fetch("/api/socket").finally(() => {
      // 2. Connect the client socket
      const socketInstance = ClientIO({
        path: "/api/socket",
        addTrailingSlash: false,
      });

      // 3. Setup connection listeners using constants
      socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
        console.log("Transmission Established");
        setIsConnected(true);
      });

      socketInstance.on(SOCKET_EVENTS.DISCONNECT, () => {
        console.log("Transmission Lost");
        setIsConnected(false);
      });

      setSocket(socketInstance);
    });

    // Cleanup on unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};