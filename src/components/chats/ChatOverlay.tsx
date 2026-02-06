"use client";

import { useState } from "react";
import { ChevronLeft, MessageSquare } from "lucide-react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { User } from "@/types/chat";
import { SocketProvider, useSocket } from "@/context/SocketContext";

// 1. The Wrapper: Handles the Provider
export function ChatOverlay({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <SocketProvider>
      <ChatContent onClose={onClose} />
    </SocketProvider>
  );
}

// 2. The Content: This component sits INSIDE the Provider and can access the user list
function ChatContent({ onClose }: { onClose: () => void }) {
  // Get the real users and connection status from your SocketContext
  const { users, isConnected } = useSocket(); 
  console.log("📋 Users from Context:", users); // Debugging log to verify users are received
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-app-bg animate-in slide-in-from-right duration-500">
      {/* --- HEADER --- */}
      <div className="h-16 border-b border-app-border flex items-center justify-between px-8 bg-app-text/5 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-3 text-app-accent hover:text-app-text group"
        >
          <ChevronLeft
            size={24}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <div className="flex flex-col items-start">
            <span className="text-[10px] uppercase tracking-[0.4em] font-black">
              Return
            </span>
            <span className="text-[8px] opacity-40 uppercase tracking-widest -mt-1">
              Dashboard
            </span>
          </div>
        </button>
        <div className="flex items-center gap-4">
          {/* Connection Indicator */}
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <div className="text-app-text/40">
            <MessageSquare size={18} />
          </div>
        </div>
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          users={users} // REAL USERS FROM CONTEXT
          selectedUserId={selectedUser?._id}
          onSelectUser={setSelectedUser}
        />
        <ChatArea activeUser={selectedUser} />
      </div>
    </div>
  );
}