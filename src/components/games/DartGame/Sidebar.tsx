"use client";
import React, { useState } from "react";
import { Shot } from './types';

export const Sidebar = ({ history }: { history: Shot[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOGGLE BUTTON: Only shows on small screens */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-2000 bg-amber-600 text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-transform"
      >
        {isOpen ? "Close Data" : "View Results"}
      </button>

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        /* Layout */
        fixed lg:relative inset-y-0 left-0 z-1001
        flex flex-col h-full border-r border-white/5 bg-black/95 lg:bg-black/40 backdrop-blur-md
        transition-transform duration-300 ease-in-out
        
        /* Desktop: Always visible, width */
        lg:translate-x-0 lg:w-80 lg:p-8
        
        /* Mobile: Full height, slide-in, width adjustment */
        ${isOpen ? "translate-x-0 w-72 p-6" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em]">
            Result Data
          </h2>
          {/* Mobile only status indicator */}
          <div className="lg:hidden h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        
        <div className="grow overflow-y-auto space-y-3 custom-scrollbar pr-2">
          {history.length === 0 ? (
            <div className="text-stone-600 text-[10px] uppercase italic text-center mt-10 border border-dashed border-white/5 py-8">
              Waiting for impact...
            </div>
          ) : (
            history.map((shot) => (
              <div 
                key={shot.id} 
                className="p-3 md:p-4 bg-white/5 border border-white/10 flex justify-between items-center hover:border-amber-500/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex flex-col">
                  <span className="text-amber-500 font-black text-sm md:text-lg group-hover:translate-x-1 transition-transform">
                    {shot.label}
                  </span>
                  
                  {shot.coords && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[8px] text-amber-500/50 font-black uppercase">Loc:</span>
                      <span className="text-[9px] font-mono text-stone-500 tracking-tighter">
                        {shot.coords}
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex flex-col items-end">
                  <span className="text-xl md:text-2xl font-mono text-stone-300">
                    +{shot.points}
                  </span>
                  <span className="text-[7px] text-stone-600 uppercase font-bold tracking-tighter">Points</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-stone-600 font-mono flex justify-between">
          <span>STATUS: ACTIVE</span>
          <span className="hidden md:inline">GRID_SYNC: OK</span>
        </div>
      </aside>

      {/* MOBILE OVERLAY: Dims the game board when sidebar is open on mobile */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/60 z-1000 backdrop-blur-sm animate-in fade-in duration-300"
        />
      )}
    </>
  );
};