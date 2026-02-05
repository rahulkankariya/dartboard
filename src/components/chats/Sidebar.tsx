"use client";

import { Search, ListFilter } from "lucide-react";
import UserItem from "./UserItem";
import { User } from "@/types/chat";

interface SidebarProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (user: User) => void;
}

export default function Sidebar({ users, selectedUserId, onSelectUser }: SidebarProps) {
  return (
    <div className="w-80 h-full border-r border-app-border bg-app-bg flex flex-col">
      {/* Sidebar Top Bar */}
      <div className="p-4 border-b border-app-border bg-app-text/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs uppercase tracking-[0.2em] font-black text-app-accent">Active Transmissions</h2>
          <ListFilter size={14} className="text-app-text/40 cursor-pointer hover:text-app-accent" />
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-app-text/30" size={14} />
          <input 
            type="text" 
            placeholder="Search Protocol..." 
            className="w-full bg-app-bg border border-app-border rounded-md py-2 pl-9 pr-4 text-xs focus:outline-none focus:border-app-accent/50 transition-all"
          />
        </div>
      </div>

      {/* User List Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {users.map((user) => (
          <UserItem 
            key={user.id} 
            user={user} 
            isActive={selectedUserId === user.id}
            onClick={() => onSelectUser(user)}
          />
        ))}
      </div>
    </div>
  );
}