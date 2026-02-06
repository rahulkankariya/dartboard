"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";
import { User } from "@/types/chat"; // Ensure this import exists

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  users: User[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  users: [], // Default to empty array
});

const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const token = getCookie("socket-token");

    if (!token) {
      console.warn("⚠️ No socket-token found in cookies.");
      return;
    }

    const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
      auth: { token } 
    });

    socketInstance.on("connect", () => {
      console.log("✅ Connected to Server:", socketInstance.id);
      setIsConnected(true);
      // Trigger the initial user list fetch
      socketInstance.emit("request-user-list", { pageIndex: 0, pageSize: 50 });
    });

    socketInstance.on("response-user-list", (response) => {
      console.log("📋 Received User List:", response);
      if (response.status === 200) {
        setUsers(response.data);
      }
    });

    socketInstance.on("connect_error", (err) => {
      console.error("📋 Socket Auth Error:", err.message);
    });

    socketInstance.on("disconnect", () => {
      console.log("❌ Disconnected");
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.off("response-user-list");
      socketInstance.disconnect();
    };
  }, []);

  return (
    // IMPORTANT: You must pass users here for it to be accessible
    <SocketContext.Provider value={{ socket, isConnected, users }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);