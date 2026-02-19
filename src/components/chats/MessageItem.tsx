"use client";
import { memo } from "react";
import { Check, FileText, Play, Download } from "lucide-react";
import { MESSAGE_TYPES } from "@/constants/chat";

interface MessageItemProps {
  msg: any;
  isOwn: boolean;
  activeUserId: string;
}

const MessageItem = memo(({ msg, isOwn, activeUserId }: MessageItemProps) => {
  console.log("Rendering MessageItem:", { msg, isOwn, activeUserId });
  // --- Status Logic ---
  const recipientStatus = msg.readStatus?.find(
    (status: any) => String(status.user) === String(activeUserId)
  );
  const isRead = msg.status === "seen" || !!recipientStatus?.readAt;
  const isDelivered = msg.status === "seen" || msg.status === "delivered" || !!recipientStatus?.deliveredAt;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // --- Render Helpers ---
  const renderContent = () => {
    console.log("Rendering message content for type:", msg.messageType);
    switch (msg.messageType) {
      case MESSAGE_TYPES.IMAGE:
        return (
          <div className="rounded-lg overflow-hidden mb-1">
            <img src={msg.content} alt="Shared image" className="max-w-full h-auto object-cover hover:opacity-95 transition-opacity cursor-pointer" />
          </div>
        );

      case MESSAGE_TYPES.AUDIO:
        return (
          <div className={`flex items-center gap-3 p-2 rounded-xl min-w-50 ${isOwn ? "bg-white/10" : "bg-app-accent/10"}`}>
            <audio controls className="h-8 w-full custom-audio-player">
              <source src={msg.content} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        );

      case MESSAGE_TYPES.VIDEO:
        return (
          <div className="rounded-lg overflow-hidden mb-1 max-w-sm">
            <video controls className="w-full">
              <source src={msg.content} />
            </video>
          </div>
        );

      case MESSAGE_TYPES.FILE:
        return (
          <a href={msg.content} target="_blank" rel="noopener noreferrer" 
             className={`flex items-center gap-3 p-3 rounded-xl border ${isOwn ? "border-white/20 bg-white/5" : "border-app-text/10 bg-app-text/5"}`}>
            <div className="p-2 bg-app-accent rounded-lg text-white">
              <FileText size={20} />
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-medium truncate">Document Shared</span>
              <span className="text-[10px] opacity-70">Click to Download</span>
            </div>
            <Download size={14} className="ml-auto opacity-60" />
          </a>
        );

      case MESSAGE_TYPES.TEXT:
      default:
        return (
          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            {msg.content}
          </p>
        );
    }
  };

  return (
    <div className={`flex w-full mb-1 ${isOwn ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
      <div className={`relative p-3 rounded-2xl max-w-[80%] lg:max-w-[70%] shadow-sm ${
          isOwn ? "bg-app-accent text-white rounded-tr-none" : "bg-app-text/10 text-app-text rounded-tl-none"
        }`}
      >
        {/* Render Dynamic Media Content */}
        {renderContent()}

        {/* Timestamp and Status Icons */}
        <div className={`flex items-center justify-end gap-1.5 mt-1 select-none ${isOwn ? "text-white/70" : "text-app-text/60"}`}>
          <span className="text-[9px] font-medium">{formatTime(msg.createdAt)}</span>

          {isOwn && (
            <div className="flex items-center ml-0.5">
              {isRead ? (
                <div className="flex -space-x-1.5">
                  <Check size={11} strokeWidth={4} className="text-blue-400" />
                  <Check size={11} strokeWidth={4} className="text-blue-400" />
                </div>
              ) : isDelivered ? (
                <div className="flex -space-x-1.5">
                  <Check size={11} strokeWidth={3} className="opacity-70" />
                  <Check size={11} strokeWidth={3} className="opacity-70" />
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