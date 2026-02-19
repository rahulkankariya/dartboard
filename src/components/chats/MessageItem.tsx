"use client";
import { memo } from "react";
import { Check } from "lucide-react";

interface MessageItemProps {
  msg: any;
  isOwn: boolean;
  activeUserId: string; 
}

const MessageItem = memo(({ msg, isOwn, activeUserId }: MessageItemProps) => {
  
  // 1. Find the specific status for the person we are chatting with
  const recipientStatus = msg.readStatus?.find(
    (status: any) => String(status.user) === String(activeUserId)
  );

  // 2. Logic: Priority given to msg.status updated by the socket hook
  const isRead = msg.status === "seen" || !!recipientStatus?.readAt;
  
  const isDelivered = 
    msg.status === "seen" || 
    msg.status === "delivered" || 
    !!recipientStatus?.deliveredAt;

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
          isOwn ? "bg-app-accent text-white rounded-tr-none" : "bg-app-text/10 text-app-text rounded-tl-none"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
          {msg.content}
        </p>

        <div className={`flex items-center justify-end gap-1.5 mt-1 select-none ${isOwn ? "text-white/70" : "text-app-text/60"}`}>
          <span className="text-[9px] font-medium">{formatTime(msg.createdAt)}</span>

          {isOwn && (
            <div className="flex items-center ml-0.5">
              {isRead ? (
                /* Blue double check */
                <div className="flex -space-x-1.5">
                  <Check size={11} strokeWidth={4} className="text-blue-400" />
                  <Check size={11} strokeWidth={4} className="text-blue-400" />
                </div>
              ) : isDelivered ? (
                /* Gray double check */
                <div className="flex -space-x-1.5">
                  <Check size={11} strokeWidth={3} className="opacity-70" />
                  <Check size={11} strokeWidth={3} className="opacity-70" />
                </div>
              ) : (
                /* Single check (Sent) */
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