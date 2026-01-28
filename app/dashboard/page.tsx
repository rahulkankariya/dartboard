"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { DartGame } from "@/components/games/DartGame";

type GameMode = "classic" | "rotate" | "slide" | null;

export default function DashboardPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);

  return (
    // Use h-screen and flex-col to lock the height to the window
    <div className="h-screen flex flex-col bg-[#0c0a09] text-stone-200 overflow-hidden">
      <Navbar />

      {/* Main content now takes the remaining height (flex-1) */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full flex flex-col space-y-4">
          {!selectedMode ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
              <header className="mb-4 shrink-0">
                <h2 className="text-lg uppercase tracking-[0.2em] font-light text-stone-400">
                  Tactical Overview
                </h2>
                <div className="h-0.5 w-12 bg-amber-600 mt-1" />
              </header>

              <div className="grid grid-cols-3 gap-4 mb-4 shrink-0">
                <DashboardStat label="System" value="Online" subValue="Ready" />
                <DashboardStat
                  label="Accuracy"
                  value="84.2%"
                  subValue="+2.4%"
                />
                <DashboardStat label="Darts" value="1,204" subValue="Total" />
              </div>

              {/* Protocol Selection takes all remaining space */}
              <div className="flex-1 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center bg-stone-900/10 backdrop-blur-sm">
                <div className="text-center mb-8">
                  <h3 className="text-amber-600 font-serif italic text-3xl mb-1">
                    Protocol Selection
                  </h3>
                  <p className="text-[10px] uppercase tracking-[0.5em] text-stone-500">
                    Initiate Training
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl px-6">
                  <ModeButton onClick={() => setSelectedMode("classic")}>
                    Steady Range
                  </ModeButton>
                  <ModeButton onClick={() => setSelectedMode("rotate")}>
                    Rotating Target
                  </ModeButton>
                  <ModeButton onClick={() => setSelectedMode("slide")}>
                    Moving Cabinet
                  </ModeButton>
                </div>
              </div>
            </div>
          ) : (
            // The Game Range now scales to fit the available space exactly
            <div className="relative flex-1 border border-white/10 rounded-lg overflow-hidden animate-in zoom-in-95 duration-500">
              <button
                onClick={() => setSelectedMode(null)}
                className="absolute top-4 right-4 z-6000 text-[10px] bg-red-950/60 hover:bg-red-600 text-red-200 px-4 py-2 border border-red-500/50 uppercase font-black transition-all"
              >
                Retry{" "}
              </button>
              <DartGame mode={selectedMode} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function DashboardStat({
  label,
  value,
  subValue,
}: {
  label: string;
  value: string;
  subValue: string;
}) {
  return (
    <div className="p-3 md:p-4 border border-white/5 bg-white/2 rounded-md">
      <p className="text-[9px] opacity-40 uppercase tracking-widest font-bold">
        {label}
      </p>
      <p className="text-xl md:text-2xl font-serif text-stone-100">{value}</p>
      <p className="text-[8px] text-stone-500 uppercase tracking-tighter">
        {subValue}
      </p>
    </div>
  );
}

const ModeButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden border border-amber-600/30 p-4 text-[10px] font-black transition-all hover:border-amber-500 active:scale-95"
  >
    <span className="relative z-10 uppercase tracking-widest group-hover:text-black">
      {children}
    </span>
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-amber-500 transition-transform duration-300 ease-out" />
  </button>
);
