"use client";
import { memo } from "react";
import { Check } from "lucide-react";
import { ChatMessage } from "@/types/chat";

interface MessageItemProps {
  msg: ChatMessage;
  isOwn: boolean;
}

const MessageItem = memo(({ msg, isOwn }: MessageItemProps) => {
  const isRead = msg.status === "read" || msg.isRead === true;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex w-full mb-1 ${isOwn ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
      <div className={`relative p-3 rounded-2xl max-w-[80%] lg:max-w-[70%] shadow-sm ${
          isOwn 
            ? "bg-app-accent text-white rounded-tr-none" 
            : "bg-app-text/10 text-app-text rounded-tl-none"
        }`}>
        
        {/* Message Text */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
          {msg.content}
        </p>

        {/* Footer: Time and Status Checks */}
        <div className="flex items-center justify-end gap-1.5 mt-1 select-none">
          <span className="text-[9px] opacity-60 font-medium">
            {formatTime(msg.createdAt)}
          </span>

          {isOwn && (
            <div className="flex items-center ml-0.5">
              {isRead ? (
                <div className="flex -space-x-1.5">
                  <Check size={11} strokeWidth={3} className="text-blue-300" />
                  <Check size={11} strokeWidth={3} className="text-blue-300" />
                </div>
              ) : (
                <Check size={11} strokeWidth={2} className="opacity-40" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";
export default MessageItem;