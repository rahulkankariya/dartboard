// src/types/chat.ts
export interface MessageReadStatus {
  user: string;
  readAt: string | null;
  deliveredAt?: string | null; // Optional, for double gray checks
}
export interface User {
  _id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  isOnline: boolean;
  lastSeen: string;
  unreadCount?: number;
  isTyping?: boolean;

  // lastMessage can now be the message object or null
  lastMessage: {
    _id: string;
    content: string;
    createdAt: string;
   sender: string | { _id: string; [key: string]: any };
    messageType: number;
    status: string;
    readStatus: MessageReadStatus[];
  } | null;
}
export interface ChatMessage {
  _id: string;
  content: string;
  sender: string | { _id: string };
  status?: string;
  createdAt?: string;
  readStatus: MessageReadStatus[];
  receiverId: string;
}