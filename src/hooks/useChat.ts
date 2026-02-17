// src/hooks/useChat.ts
import { useState, useEffect, useCallback } from "react";
import { SOCKET_EVENTS } from "@/constants/socket-events";

// Define a Message type to avoid 'any'
export interface Message {
  _id: string;
  content: string;
  sender: string | { _id: string };
  status?: string;
  isRead?: boolean;
  createdAt?: string;
}

export const useChat = (socket: any, activeUser: any) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !socket || !activeUser) return;
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      receiverId: activeUser._id,
      content,
      type: 1,
    });
  }, [socket, activeUser]);

  useEffect(() => {
    if (!socket || !activeUser) return;

    setMessages([]);

    socket.emit(SOCKET_EVENTS.REQUEST_CHAT_HISTORY, {
      receiverId: activeUser._id,
      pageIndex: 0,
    });

    const handleHistory = (response: any) => {
      if (response.status === 200 && response.receiverId === activeUser._id) {
        setMessages([...(response?.messageList ?? [])].reverse());
      }
    };

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    };

    socket.on(SOCKET_EVENTS.RESPONSE_MESSAGE_LIST, handleHistory);
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_SENT_SUCCESS, handleNewMessage);

    return () => {
      socket.off(SOCKET_EVENTS.RESPONSE_MESSAGE_LIST, handleHistory);
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_SENT_SUCCESS, handleNewMessage);
    };
  }, [socket, activeUser]);

  return { messages, sendMessage };
};