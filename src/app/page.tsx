"use client";

import { useState } from "react";
// ❌ REMOVED 'Sidebar' from lucide-react to avoid clashing with your component
import { X, MessageSquare } from "lucide-react"; 
import { Navbar } from "@/components/Navbar";
import { User } from "@/types/chat";

// ✅ Import your CUSTOM Sidebar component (ensure the path is correct)

import ChatArea from "@/components/chats/ChatArea";
import Sidebar from "@/components/chats/Sidebar";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const adminUser = { firstName: "John", lastName: "Doe" };
  const mockUsers: User[] = [
    { id: "1", name: "Alpha Support", lastMsg: "System live", time: "10:00", status: "online" },
    { id: "2", name: "Beta Tech", lastMsg: "Waiting...", time: "11:30", status: "offline" },
  ];

  return (

      <div className="min-h-screen bg-app-bg text-app-text">
        <Navbar 
          user={adminUser} 
          activeSession="Secure-Line"
          isChatOpen={isChatOpen} 
          onToggleChat={() => setIsChatOpen(!isChatOpen)} 
        />

        <main className="relative h-[calc(100vh-80px)] overflow-hidden p-6">
          <div className={`transition-all duration-300 ${isChatOpen ? "blur-md scale-95 opacity-50" : ""}`}>
             <h2 className="text-xl font-bold">Main Dashboard View</h2>
             <p className="text-app-text/60">Your active dartboard stats would appear here.</p>
          </div>

          {isChatOpen && (
            <div className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in zoom-in duration-300">
              <div className="w-full max-w-6xl h-full bg-app-bg border border-app-border rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex relative overflow-hidden">
                
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="absolute top-4 right-4 z-60 text-app-text/40 hover:text-app-accent transition-colors"
                >
                  <X size={24} />
                </button>

                {/* ✅ Now using the correct Sidebar component */}
                <Sidebar 
                  users={mockUsers} 
                  selectedUserId={selectedUser?.id} 
                  onSelectUser={(user: User) => setSelectedUser(user)} 
                />

                <ChatArea activeUser={selectedUser} />
              </div>
            </div>
          )}
        </main>
      </div>

  );
}