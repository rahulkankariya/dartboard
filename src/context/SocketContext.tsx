"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
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

  // --- FIXED HELPER ---
  // Ensures lastMessage is preserved during status updates
  const updateUserData = useCallback(
    (userId: string, updates: Partial<User>, shouldMoveToTop = false) => {
      setUsers((prevUsers) => {
        const userIndex = prevUsers.findIndex((u) => u._id === userId);

        if (userIndex === -1) return prevUsers;

        const updatedList = [...prevUsers];
        const currentUser = updatedList[userIndex];

        // Merge updates carefully to avoid wiping out the message preview
        const updatedUser: User = {
          ...currentUser,
          ...updates,
          // If updates contains a message, use it. Otherwise, keep the old one.
          lastMessage: updates.lastMessage 
            ? {
                ...updates.lastMessage,
                createdAt: updates.lastMessage?.createdAt || new Date().toISOString(),
              }
            : currentUser.lastMessage,
          // Ensure online status is explicitly handled
          isOnline: updates.isOnline !== undefined ? updates.isOnline : currentUser.isOnline,
        };

        if (shouldMoveToTop) {
          updatedList.splice(userIndex, 1);
          return [updatedUser, ...updatedList];
        } else {
          updatedList[userIndex] = updatedUser;
          return updatedList;
        }
      });
    },
    []
  );

  useEffect(() => {
    const token = getCookie("socket-token");
    if (!token) return;

    const socketInstance = ClientIO(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        transports: ["websocket"],
        auth: { token },
        upgrade: false,
      }
    );

    socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
      setIsConnected(true);
      socketInstance.emit(SOCKET_EVENTS.REQUEST_USER_LIST, {
        pageIndex: 0,
        pageSize: 50,
      });
    });

    // 1. Initial Load
    socketInstance.on(SOCKET_EVENTS.RESPONSE_USER_LIST, (response) => {
      if (response.status === 200) {
        setUsers(response.data);
      }
    });

    // 2. Incoming Messages
    socketInstance.on(
      SOCKET_EVENTS.RECEIVE_MESSAGE,
      (newMessage: ChatMessage) => {
        const senderId =
          typeof newMessage.sender === "string"
            ? newMessage.sender
            : newMessage.sender._id;

        updateUserData(senderId, { lastMessage: newMessage as any }, true);
      }
    );

    // 3. Outgoing Messages
    socketInstance.on(SOCKET_EVENTS.MESSAGE_SENT_SUCCESS, (response: any) => {
      const msg = response.message || response;
      const receiverId = msg.receiverId || (typeof msg.receiver === 'string' ? msg.receiver : msg.receiver?._id);
      
      if (receiverId) {
        updateUserData(receiverId, { lastMessage: msg }, true);
      }
    });

    // 4. Presence (Status Change)
    socketInstance.on(
      SOCKET_EVENTS.USER_STATUS_CHANGED,
      (data: { userId: string; isOnline: boolean }) => {
        // false here ensures the user stays in their current list position
        updateUserData(data.userId, { isOnline: data.isOnline }, false);
      }
    );

    socketInstance.on(SOCKET_EVENTS.DISCONNECT, () => setIsConnected(false));

    setSocket(socketInstance);

    return () => {
      socketInstance.off(SOCKET_EVENTS.RESPONSE_USER_LIST);
      socketInstance.off(SOCKET_EVENTS.RECEIVE_MESSAGE);
      socketInstance.off(SOCKET_EVENTS.MESSAGE_SENT_SUCCESS);
      socketInstance.off(SOCKET_EVENTS.USER_STATUS_CHANGED);
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