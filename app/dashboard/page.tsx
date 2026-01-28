"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DartGame } from "@/components/games/DartGame";

type GameMode = "classic" | "rotate" | "slide" | null;

export default function DashboardPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);

  return (
    <div className="h-screen flex flex-col bg-app-bg text-app-text overflow-hidden transition-colors duration-300">
      <Navbar />

      <main className="flex-1 p-3 md:p-6 overflow-hidden flex flex-col">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
          
          {!selectedMode ? (
            /* SELECTION SCREEN */
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
              <header className="mb-4 shrink-0">
                <h2 className="text-lg uppercase tracking-[0.2em] font-light opacity-50">
                  Tactical Overview
                </h2>
                <div className="h-0.5 w-12 bg-app-accent mt-1" />
              </header>

              <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 shrink-0">
                <DashboardStat label="System" value="Online" subValue="Ready" />
                <DashboardStat label="Accuracy" value="84.2%" subValue="+2.4%" />
                <DashboardStat label="Darts" value="1,204" subValue="Total" />
              </div>

              <div className="flex-1 border border-dashed border-app-border rounded-lg flex flex-col items-center justify-center bg-app-text/2 backdrop-blur-sm p-4">
                <div className="text-center mb-8">
                  <h3 className="text-app-accent font-serif italic text-2xl md:text-3xl mb-1">
                    Protocol Selection
                  </h3>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-[0.5em] opacity-40">
                    Initiate Training
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
                  <ModeButton onClick={() => setSelectedMode("classic")}>Steady Range</ModeButton>
                  <ModeButton onClick={() => setSelectedMode("rotate")}>Rotating Target</ModeButton>
                  <ModeButton onClick={() => setSelectedMode("slide")}>Moving Cabinet</ModeButton>
                </div>
              </div>
            </div>
          ) : (
            /* GAME SCREEN */
            <div className="flex-1 flex flex-col min-h-0 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center mb-2 shrink-0">
                <span className="text-[10px] uppercase tracking-[0.3em] text-app-accent font-bold">
                  Active Session: {selectedMode}
                </span>
                <button
                  onClick={() => setSelectedMode(null)}
                  className="text-[9px] bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 px-3 py-1.5 border border-red-500/50 uppercase font-black transition-all"
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
      </main>
    </div>
  );
}

function DashboardStat({ label, value, subValue }: { label: string; value: string; subValue: string }) {
  return (
    <div className="p-2 md:p-4 border border-app-border bg-app-text/3 rounded-md">
      <p className="text-[7px] md:text-[9px] opacity-40 uppercase tracking-widest font-bold truncate">{label}</p>
      <p className="text-sm md:text-2xl font-serif text-app-text">{value}</p>
      <p className="text-[7px] md:text-[8px] opacity-30 uppercase tracking-tighter">{subValue}</p>
    </div>
  );
}

const ModeButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden border border-app-accent/30 p-3 md:p-4 text-[9px] md:text-[10px] font-black transition-all hover:border-app-accent active:scale-95 text-app-text"
  >
    <span className="relative z-10 uppercase tracking-widest group-hover:text-app-bg transition-colors duration-300">
      {children}
    </span>
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-app-accent transition-transform duration-300 ease-out" />
  </button>
);