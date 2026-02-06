"use client";

import { User } from "@/types/chat";

interface UserItemProps {
  user: User;
  isActive: boolean;
  onClick: () => void;
}

export default function UserItem({ user, isActive, onClick }: UserItemProps) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-4 cursor-pointer transition-all border-l-2 ${
        isActive 
          ? 'bg-app-accent/10 border-app-accent shadow-inner' 
          : 'border-transparent hover:bg-app-text/5'
      }`}
    >
      {/* Avatar with Status Indicator */}
      <div className="relative shrink-0">
        <div className="h-10 w-10 rounded-full bg-app-accent/20 border border-app-accent/30 flex items-center justify-center text-app-accent font-bold text-xs">
          {user.fullName.substring(0, 2).toUpperCase()}
        </div>
        {user.status === "online" && (
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-app-bg" />
        )}
      </div>

      {/* User Details */}
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <p className="text-sm font-medium text-app-text truncate">{user.fullName}</p>
          <span className="text-[9px] text-app-text/40 font-mono">{user.lastMessageTime}</span>
        </div>
        <p className="text-[11px] text-app-text/50 truncate tracking-tight">
          {user.lastMessage}
        </p>
      </div>
    </div>
  );
}