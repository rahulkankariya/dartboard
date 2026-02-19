"use client";

import { useSocket } from "@/context/SocketContext";
import { User } from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { uploadMedia } from "@/api/upload.api";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import EmptyState from "./EmptyState";
import { MESSAGE_TYPES } from "@/constants/chat";

export default function ChatArea({ activeUser }: { activeUser: User | null }) {
  const { socket } = useSocket();
  const { messages, sendMessage, loadMore, hasMore } = useChat(
    socket,
    activeUser,
  );

  const handleSendVoice = async (blob: Blob) => {
    try {
      const fileName = `voice-${Date.now()}.mp3`;

      // Pass the single blob (now allowed by our updated API service)
      const result = await uploadMedia(blob, fileName);

      if (result.success) {
        console.log("Voice upload successful, server response:", result);

        // 1. Get the raw path from the server
        const rawPath = result.data[0].path; // Use .path instead of .fullOSPath if available

        // 2. Build the reachable URL
        // We combine your server address with the virtual path
        const API_BASE = "http://localhost:5000";

        // Ensure we use forward slashes and remove any double slashes
        const cleanPath = rawPath.replace(/\\/g, "/");
        const savedAudioUrl = `${API_BASE}${cleanPath}`;

        console.log("FINAL PLAYABLE URL:", savedAudioUrl);
        // This should look like: http://localhost:5000/uploads/1771517266178-683914147.mp3

        // 3. Send the HTTP URL, NOT the D:/ path
        sendMessage(savedAudioUrl, MESSAGE_TYPES.AUDIO);
      }
    } catch (error) {
      console.error("Voice Upload Error:", error);
    }
  };

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
        onSend={(val) => sendMessage(val, MESSAGE_TYPES.TEXT)}
        onSendVoice={handleSendVoice}
        placeholder={`Secure channel to ${activeUser.fullName.split(" ")[0]}...`}
      />
    </div>
  );
}
