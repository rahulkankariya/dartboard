// src/types/chat.ts

export interface User {
  _id: string;
  fullName: string;
  email?: string;
  avatar?: string;
  // Add these new fields:
  status?: "online" | "offline" | string; 
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface ChatMessage {
  _id: string;
  content: string;
  sender: string | { _id: string };
  status?: string;
  isRead?: boolean;
  createdAt?: string;
}