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
  
  const { messages, sendMessage, loadMore, hasMore } = useChat(socket, activeUser);

  // --- ADD THIS FUNCTION ---
const handleSendVoice = (blob: Blob) => {
    // 1. Create the URL from the blob
    const audioUrl = URL.createObjectURL(blob);
    
    // --- DOWNLOAD LOGIC ---
    // 2. Create a temporary anchor element
    const link = document.createElement("a");
    link.href = audioUrl;
    
    // 3. Set the file name (e.g., voice-message-timestamp.mp3)
    const timestamp = new Date().getTime();
    link.download = `voice-message-${timestamp}.mp3`;
    
    // 4. Append to body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // -----------------------

    // Optional: Keep the playback logic if you want to hear it too
    const audio = new Audio(audioUrl);
    audio.play();

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl); // Clean up memory
    };
  };
  // --------------------------

  if (!activeUser) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg border-l border-app-border overflow-hidden">
      <ChatHeader user={activeUser} />

      <MessageList 
        messages={messages} 
        activeUser={activeUser} 
        onLoadMore={loadMore} 
        hasMore={hasMore}    
      />

      <MessageInput 
        onSend={sendMessage} 
        onSendVoice={handleSendVoice} // Changed from onSendVoice to handleSendVoice
        placeholder={`Secure channel to ${activeUser.fullName.split(' ')[0]}...`} 
      />
    </div>
  );
}