"use client";
import { memo } from "react";
import { Check } from "lucide-react";
import { ChatMessage } from "@/types/chat";

interface MessageItemProps {
  msg: ChatMessage;
  isOwn: boolean;
  currentUser: any; // Added to fix the TypeScript error and handle read status
}

const MessageItem = memo(({ msg, isOwn, currentUser }: MessageItemProps) => {
  // Logic for WhatsApp-style checkmarks:
  // 1. Find the recipient's entry in the readStatus array
  const recipientStatus = msg.readStatus?.find(
    (status: any) => String(status.user) !== String(currentUser?._id)
  );

  // 2. Determine visual states
  const isRead = !!recipientStatus?.readAt;
  const isDelivered = !!recipientStatus?.deliveredAt;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div 
      className={`flex w-full mb-1 ${isOwn ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 duration-300`}
    >
      <div 
        className={`relative p-3 rounded-2xl max-w-[80%] lg:max-w-[70%] shadow-sm ${
          isOwn 
            ? "bg-app-accent text-white rounded-tr-none" 
            : "bg-app-text/10 text-app-text rounded-tl-none"
        }`}
      >
        {/* Message Text */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {msg.content}
        </p>

        {/* Footer: Time and Status Checks */}
        <div className={`flex items-center justify-end gap-1.5 mt-1 select-none ${isOwn ? "text-white/70" : "text-app-text/60"}`}>
          <span className="text-[9px] font-medium">
            {formatTime(msg.createdAt)}
          </span>

          {isOwn && (
            <div className="flex items-center ml-0.5">
              {isRead ? (
                /* Blue Double Check - Seen */
                <div className="flex -space-x-1.5">
                  <Check size={11} strokeWidth={4} className="text-blue-400" />
                  <Check size={11} strokeWidth={4} className="text-blue-400" />
                </div>
              ) : isDelivered ? (
                /* Gray Double Check - Delivered but not seen */
                <div className="flex -space-x-1.5">
                  <Check size={11} strokeWidth={3} className="opacity-70" />
                  <Check size={11} strokeWidth={3} className="opacity-70" />
                </div>
              ) : (
                /* Gray Single Check - Sent but not delivered */
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