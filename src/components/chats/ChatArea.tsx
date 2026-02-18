"use client";

import { useSocket } from "@/context/SocketContext";
import { User } from "@/types/chat";
import { useChat } from "@/hooks/useChat";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyState from "./EmptyState";

export default function ChatArea({ activeUser }: { activeUser: User | null }) {
  const { socket } = useSocket();
  
  // Logic hook handles fetching history and real-time message syncing
  const { messages, sendMessage,loadMore, hasMore } = useChat(socket, activeUser);
  // console.log("ChatArea Rendered with messages:", loadMore,hasMore);
  if (!activeUser) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg border-l border-app-border overflow-hidden">
      <ChatHeader user={activeUser} />

      {/* Renders the scrollable message thread */}
      <MessageList 
        messages={messages} 
        activeUser={activeUser} 
        onLoadMore={loadMore} // Missing property 1
        hasMore={hasMore}     // Missing property 2
      />

      {/* Handles text input and socket emission */}
      <MessageInput 
        onSend={sendMessage} 
        placeholder={`Secure channel to ${activeUser.fullName.split(' ')[0]}...`} 
      />
    </div>
  );
}