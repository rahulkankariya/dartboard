"use client";
import { User } from "@/types/chat";

export default function UserItem({ user, isActive, onClick }: { user: User, isActive: boolean, onClick: () => void }) {
  const lastMsg = user.lastMessage?.content;
  const time = user.lastMessage?.createdAt 
    ? new Date(user.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    : null;

  return (
    <div onClick={onClick} className={`flex items-center p-4 cursor-pointer border-l-2 transition-all ${
      isActive ? 'bg-app-accent/10 border-app-accent' : 'border-transparent hover:bg-app-text/5'
    }`}>
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
      <div className="ml-3 flex-1 overflow-hidden">
        <div className="flex justify-between items-baseline">
          <p className="text-sm font-medium truncate">{user.fullName}</p>
          {time && <span className="text-[9px] opacity-40 font-mono">{time}</span>}
        </div>
        <p className="text-[11px] truncate opacity-50">{lastMsg || "No messages"}</p>
      </div>
    </div>
  );
}