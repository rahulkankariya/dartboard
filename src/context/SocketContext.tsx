"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io as ClientIO, Socket } from "socket.io-client";
import { User, ChatMessage } from "@/types/chat";
import { SOCKET_EVENTS } from "@/constants/socket-events";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
  users: User[];
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  users: [],
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

  // Helper to update a single user in the list and optionally re-sort
  const updateUserData = useCallback((userId: string, updates: Partial<User>, shouldSort = false) => {
    setUsers((prevUsers) => {
      const updatedList = prevUsers.map((user) =>
        user._id === userId ? { ...user, ...updates } : user
      );

      if (shouldSort) {
        return [...updatedList].sort((a, b) => {
          const timeA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
          const timeB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
          return timeB - timeA;
        });
      }
      return updatedList;
    });
  }, []);

  useEffect(() => {
    const token = getCookie("socket-token");
    if (!token) return;

    const socketInstance = ClientIO(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
      auth: { token } 
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      // Fetch initial sidebar list
      socketInstance.emit("request-chat-list", { pageIndex: 0, pageSize: 50 });
    });

    // 1. Initial User List Load
    socketInstance.on("response-chat-list", (response) => {
      if (response.status === 200) setUsers(response.data);
    });

    // 2. Real-time Last Message Update (Incoming)
    socketInstance.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (newMessage: ChatMessage) => {
      const senderId = typeof newMessage.sender === "string" ? newMessage.sender : newMessage.sender._id;
      updateUserData(senderId, { lastMessage: newMessage as any }, true);
    });

    // 3. Real-time Last Message Update (Outgoing Success)
    socketInstance.on(SOCKET_EVENTS.MESSAGE_SENT_SUCCESS, (sentMessage: ChatMessage) => {
      const receiverId = (sentMessage as any).receiverId || (sentMessage as any).receiver;
      updateUserData(receiverId, { lastMessage: sentMessage as any }, true);
    });

    // 4. Online/Offline Presence Toggles
   socketInstance.on("user-status-changed", (data: { userId: string, isOnline: boolean }) => {
  updateUserData(data.userId, { isOnline: data.isOnline });
});

    socketInstance.on("disconnect", () => setIsConnected(false));

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [updateUserData]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, users }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);