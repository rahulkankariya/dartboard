"use client";

import { ShieldCheck } from "lucide-react";
import { DartGame } from "@/components/games/DartGame";

export function ActiveSession({ mode, onTerminate }: { mode: string; onTerminate: () => void }) {
  return (
    <div className="flex-1 flex flex-col min-h-0 animate-in zoom-in-95 duration-500">
      <div className="flex justify-between items-center mb-2 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.3em] text-app-accent font-bold flex items-center gap-2">
          <ShieldCheck size={14} /> Active Session: {mode}
        </span>
        <button 
          onClick={onTerminate} 
          className="text-[9px] bg-red-500/10 hover:bg-red-600 hover:text-white text-red-600 px-4 py-2 border border-red-500/50 uppercase font-black transition-all"
        >
          Terminate [ESC]
        </button>
      </div>
      <div className="relative flex-1 border border-app-border rounded-lg overflow-hidden bg-app-text/3">
        <DartGame mode={mode as any} />
      </div>
    </div>
  );
}