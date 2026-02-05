"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, MessageSquare, ShieldCheck } from "lucide-react"; 
import { Navbar } from "@/components/Navbar";
import { DartGame } from "@/components/games/DartGame";
import { SocketProvider } from "@/context/SocketContext";
import { User } from "@/types/chat";

// Components - Ensure these paths match your folder structure
import Sidebar from "@/components/chats/Sidebar";
import ChatArea from "@/components/chats/ChatArea";

type GameMode = "classic" | "rotate" | "slide" | null;

export default function DashboardPage() {
  // Game & UI States
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const terminateSession = useCallback(() => {
    setSelectedMode(null);
  }, []);

  // Managed Escape Key Logic
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isChatOpen) {
          setIsChatOpen(false); // Close chat first if open
        } else if (selectedMode) {
          terminateSession(); // Otherwise terminate game
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isChatOpen, selectedMode, terminateSession]);

  const user = { firstName: "John", lastName: "Doe" };
  
  const mockUsers: User[] = [
    { id: "1", name: "Command Center", lastMsg: "Link Established", time: "10:00", status: "online" },
    { id: "2", name: "Tech Support", lastMsg: "Hardware Optimized", time: "09:45", status: "offline" },
  ];

  return (
    <SocketProvider>
      <div className="h-screen flex flex-col bg-app-bg text-app-text overflow-hidden transition-colors duration-300">
        
        {/* Top Navigation */}
        <Navbar 
          user={user} 
          activeSession={selectedMode} 
          isChatOpen={isChatOpen}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
        />

        <main className="flex-1 overflow-hidden flex flex-col relative">
          
          {/* LAYER 1: Main Dashboard / Game Interface */}
          <div className={`flex-1 p-3 md:p-6 transition-all duration-700 ease-in-out ${
            isChatOpen ? "blur-3xl scale-[0.9] opacity-0 pointer-events-none" : "opacity-100"
          }`}>
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
              {!selectedMode ? (
                /* PROTOCOL SELECTION UI */
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
                  <header className="mb-4 shrink-0">
                    <h2 className="text-lg uppercase tracking-[0.2em] font-light opacity-50">Tactical Overview</h2>
                    <div className="h-0.5 w-12 bg-app-accent mt-1" />
                  </header>

                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 shrink-0">
                    <DashboardStat label="System" value="Online" subValue="Ready" />
                    <DashboardStat label="Accuracy" value="84.2%" subValue="+2.4%" />
                    <DashboardStat label="Darts" value="1,204" subValue="Total" />
                  </div>

                  <div className="flex-1 border border-dashed border-app-border rounded-lg flex flex-col items-center justify-center bg-app-text/2 backdrop-blur-sm p-4">
                    <div className="text-center mb-8">
                      <h3 className="text-app-accent font-serif italic text-2xl md:text-3xl mb-1">Protocol Selection</h3>
                      <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Initiate Training</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                      <ModeButton onClick={() => setSelectedMode("classic")}>Steady Range</ModeButton>
                      <ModeButton onClick={() => setSelectedMode("rotate")}>Rotating Target</ModeButton>
                      <ModeButton onClick={() => setSelectedMode("slide")}>Moving Cabinet</ModeButton>
                    </div>
                  </div>
                </div>
              ) : (
                /* ACTIVE GAME SESSION UI */
                <div className="flex-1 flex flex-col min-h-0 animate-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-2 shrink-0">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-app-accent font-bold flex items-center gap-2">
                      <ShieldCheck size={14} /> Active Session: {selectedMode}
                    </span>
                    <button 
                      onClick={terminateSession} 
                      className="text-[9px] bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 px-4 py-2 border border-red-500/50 uppercase font-black transition-all"
                    >
                      Terminate [ESC]
                    </button>
                  </div>
                  <div className="relative flex-1 border border-app-border rounded-lg overflow-hidden bg-app-text/3">
                    <DartGame mode={selectedMode} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LAYER 2: 100% Height Chat Overlay */}
          {isChatOpen && (
            <div className="absolute inset-0 z-50 flex flex-col bg-app-bg animate-in slide-in-from-right duration-500 ease-out">
              
              {/* Tactical Header (Replaces X) */}
              <div className="h-16 border-b border-app-border flex items-center justify-between px-8 bg-app-text/5 shrink-0">
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="flex items-center gap-3 text-app-accent hover:text-app-text transition-all group"
                >
                  <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-black">Return</span>
                    <span className="text-[8px] opacity-40 uppercase tracking-widest -mt-1">Dashboard</span>
                  </div>
                </button>
                
                <div className="hidden md:flex flex-col items-center">
                   <h2 className="text-xs font-bold uppercase tracking-[0.2em]">Secure Communication Channel</h2>
                   <div className="flex items-center gap-1.5 mt-1">
                      <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[8px] opacity-50 uppercase tracking-tighter text-emerald-500">Encrypted Link Active</span>
                   </div>
                </div>

                <div className="flex items-center gap-4 text-app-text/40">
                  <MessageSquare size={18} />
                </div>
              </div>

              {/* Chat Viewport */}
              <div className="flex-1 flex overflow-hidden">
                <Sidebar 
                  users={mockUsers} 
                  selectedUserId={selectedUser?.id} 
                  onSelectUser={(u: User) => setSelectedUser(u)} 
                />
                <ChatArea activeUser={selectedUser} />
              </div>
            </div>
          )}
        </main>
      </div>
    </SocketProvider>
  );
}

/** Dashboard Components **/

function DashboardStat({ label, value, subValue }: { label: string; value: string; subValue: string }) {
  return (
    <div className="p-3 md:p-5 border border-app-border bg-app-text/3 rounded-sm">
      <p className="text-[8px] md:text-[10px] opacity-30 uppercase tracking-[0.2em] font-bold truncate mb-1">{label}</p>
      <p className="text-xl md:text-3xl font-serif text-app-text leading-none">{value}</p>
      <p className="text-[8px] opacity-20 uppercase tracking-tighter mt-1">{subValue}</p>
    </div>
  );
}

const ModeButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden border border-app-accent/20 p-4 md:p-6 text-[10px] font-black transition-all hover:border-app-accent active:scale-95 text-app-text"
  >
    <span className="relative z-10 uppercase tracking-widest group-hover:text-app-bg transition-colors duration-300">{children}</span>
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-app-accent transition-transform duration-500 ease-out" />
  </button>
);