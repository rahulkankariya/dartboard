"use client";
import { User } from "@/types/chat";

interface UserItemProps {
  user: User;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string; // Ensure this is passed from parent!
}

export default function UserItem({ user, isActive, onClick, currentUserId }: UserItemProps) {
  const lastMessage = user.lastMessage;
  
  // Fix: Check if sender ID matches your ID
  const isMe = lastMessage?.sender === currentUserId;
  
  // Fix: Use nullish coalescing to hide badge if count is 0
  const unreadCount = user.unreadCount ?? 10;

  const lastMsgContent = lastMessage?.content;
  const displayMsg = lastMsgContent 
    ? (isMe ? `You: ${lastMsgContent}` : lastMsgContent) 
    : "No messages";

  const time = lastMessage?.createdAt 
    ? new Date(lastMessage.createdAt).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) 
    : null;

  return (
    <div 
      onClick={onClick} 
      className={`flex items-center p-4 cursor-pointer border-l-2 transition-all ${
        isActive ? 'bg-app-accent/10 border-app-accent' : 'border-transparent hover:bg-app-text/5'
      }`}
    >
      {/* Avatar Section */}
      <div className="relative shrink-0">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs border ${
          isActive ? "bg-app-accent text-white" : "bg-app-accent/10 text-app-accent"
        }`}>
          {user.fullName.substring(0, 2).toUpperCase()}
        </div>
        <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-app-bg ${
          user.isOnline ? "bg-emerald-500" : "bg-rose-500"
        }`} />
      </div>

      {/* Content Section */}
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <p className="text-sm font-medium truncate">{user.fullName}</p>
          {time && (
            <span className="text-[10px] opacity-40 font-mono shrink-0 ml-2">
              {time}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-0.5">
          <p className={`text-[11px] truncate flex-1 ${
            unreadCount > 0 && !isActive ? "text-app-text font-semibold opacity-90" : "opacity-50"
          }`}>
            {displayMsg}
          </p>
          
          {unreadCount > 0 && (
            <span className="ml-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-app-accent px-1 text-[9px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}