// src/types/chat.ts

export interface User {
  _id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  isOnline: boolean;
  lastSeen: string;
  unreadCount?:number
  // lastMessage can now be the message object or null
  lastMessage: {
    _id: string;
    content: string;
    createdAt: string;
    sender: string;
    messageType: number;
  } | null;
}
export interface ChatMessage {
  _id: string;
  content: string;
  sender: string | { _id: string };
  status?: string;
  isRead?: boolean;
  createdAt?: string;
}