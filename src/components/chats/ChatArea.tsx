"use client";

import { useSocket } from "@/context/SocketContext";
import { User } from "@/types/chat";
import { useChat } from "@/hooks/useChat";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyState from "./EmptyState";

/**
 * ChatArea is the main controller component.
 * It manages the layout and bridges the Socket state with the UI components.
 */
export default function ChatArea({ activeUser }: { activeUser: User | null }) {
  const { socket } = useSocket();
  
  // useChat handles message history, real-time receiving, and read receipts
  const { messages, sendMessage } = useChat(socket, activeUser);

  // If no user is selected from the sidebar, show the fallback UI
  if (!activeUser) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg border-l border-app-border overflow-hidden">
      
      {/* 1. Header: Displays user name and online status */}
      <ChatHeader user={activeUser} />

      {/* 2. Message List: Handles scrolling logic and rendering ChatMessage items */}
      <MessageList 
        messages={messages} 
        activeUser={activeUser} 
      />

      {/* 3. Message Input: Isolated state for typing to prevent list re-renders */}
      <MessageInput 
        onSend={sendMessage} 
        placeholder={`Secure channel to ${activeUser.fullName.split(' ')[0]}...`} 
      />
      
    </div>
  );
}