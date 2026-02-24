"use client";

import { useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { useKeyboardControls } from "@/hooks/useKeyboardControls";

// Components
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ModeSelection } from "@/components/dashboard/ModeSelection";
import { ActiveSession } from "@/components/dashboard/ActiveSession";
import { ChatOverlay } from "@/components/chats/ChatOverlay";
import  OrgHierarchy  from "@/components/hierarchy/OrgHierarchy";

export type GameMode = "classic" | "rotate" | "slide" | null;

export default function DashboardPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
   const [isHierarchyOpen, setIsHierarchyOpen] = useState(false);


  const terminateSession = useCallback(() => setSelectedMode(null), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);

  useKeyboardControls(isChatOpen, !!selectedMode, closeChat, terminateSession);

  return (
   
      <div className="h-screen flex flex-col bg-app-bg text-app-text overflow-hidden transition-colors duration-300">
        <Navbar 
          user={{ firstName: "Rahul", lastName: "Kankariya" }} 
          activeSession={selectedMode} 
          isChatOpen={isChatOpen}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          isHierarchyOpen={isHierarchyOpen}
      onToggleHierarchy={() => {
        setIsHierarchyOpen(!isHierarchyOpen);
        if (!isHierarchyOpen) setIsChatOpen(false); // Close chat if hierarchy opens
      }}
        />

        <main className="flex-1 overflow-hidden flex flex-col relative">
          {/* Dashboard/Game Layer */}
          <div className={`flex-1 p-3 md:p-6 transition-all duration-700 ease-in-out ${
            isChatOpen ? "blur-3xl scale-[0.9] opacity-0 pointer-events-none" : "opacity-100"
          }`}>
            <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
              {!selectedMode ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
                  <DashboardHeader />
                  <DashboardStats />
                  <ModeSelection onSelect={setSelectedMode} />
                </div>
              ) : (
                <ActiveSession mode={selectedMode} onTerminate={terminateSession} />
              )}
            </div>
          </div>

          {/* Chat Layer */}
          <ChatOverlay isOpen={isChatOpen} onClose={closeChat} />

          <OrgHierarchy isOpen={isHierarchyOpen} onClose={() => setIsHierarchyOpen(false)} />
        </main>
      </div>
    
  );
}