"use client";
import { useRef, useEffect } from "react";
import { ChatMessage, User } from "@/types/chat";
import MessageItem from "./MessageItem";

interface MessageListProps {
  messages: ChatMessage[];
  activeUser: User;
}

export default function MessageList({ messages, activeUser }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Helper: safely get ID from the sender union type
  const getSenderId = (sender: string | { _id: string }): string => {
    return typeof sender === "string" ? sender : sender._id;
  };

  // Auto-scroll logic: triggers every time the messages array updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
      {messages.map((m, i) => {
        const mSenderId = getSenderId(m.sender);
        // If sender ID is NOT the activeUser, then it is "Own" (Sent by Me)
        const isOwn = String(mSenderId) !== String(activeUser._id);

        return (
          <MessageItem 
            key={m._id || `msg-${i}`} 
            msg={m} 
            isOwn={isOwn} 
          />
        );
      })}
      {/* Invisible anchor for the scroll-to-bottom logic */}
      <div ref={scrollRef} className="h-1" />
    </div>
  );
}