"use client";
import React, { useState } from "react";
import { Shot } from './types';

export const Sidebar = ({ history }: { history: Shot[] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOGGLE: Using app-accent for the button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 left-6 z-60 bg-app-accent text-app-bg px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-transform"
      >
        {isOpen ? "Close Data" : "View Results"}
      </button>

      {/* SIDEBAR CONTAINER: Uses app-bg and app-border */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        flex flex-col h-full border-r border-app-border bg-app-bg/95 lg:bg-app-bg/40 backdrop-blur-md
        transition-all duration-300 ease-in-out
        
        lg:translate-x-0 lg:w-80 lg:p-8
        ${isOpen ? "translate-x-0 w-72 p-6" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[10px] text-app-accent font-black uppercase tracking-[0.4em]">
            Result Data
          </h2>
          <div className="lg:hidden h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        
        {/* LIST SECTION */}
        <div className="grow overflow-y-auto space-y-3 custom-scrollbar pr-2">
          {history.length === 0 ? (
            <div className="text-app-text/30 text-[10px] uppercase italic text-center mt-10 border border-dashed border-app-border py-8">
              Waiting for impact...
            </div>
          ) : (
            history.map((shot) => (
              <div 
                key={shot.id} 
                className="p-3 md:p-4 bg-app-text/3 border border-app-border flex justify-between items-center hover:border-app-accent/40 transition-all group relative overflow-hidden"
              >
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-app-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 flex flex-col">
                  <span className="text-app-accent font-black text-sm md:text-lg group-hover:translate-x-1 transition-transform">
                    {shot.label}
                  </span>
                  
                  {shot.coords && (
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-[8px] text-app-accent/50 font-black uppercase">Loc:</span>
                      <span className="text-[9px] font-mono text-app-text/40 tracking-tighter">
                        {shot.coords}
                      </span>
                    </div>
                  )}
                </div>

                <div className="relative z-10 flex flex-col items-end">
                  <span className="text-xl md:text-2xl font-mono text-app-text font-light">
                    +{shot.points}
                  </span>
                  <span className="text-[7px] text-app-text/30 uppercase font-black tracking-tighter">Points</span>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* FOOTER STATS */}
        <div className="mt-4 pt-4 border-t border-app-border text-[9px] text-app-text/30 font-mono flex justify-between">
          <span>STATUS: ACTIVE</span>
          <span className="hidden md:inline text-app-accent/50">GRID_SYNC: OK</span>
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm animate-in fade-in duration-300"
        />
      )}
    </>
  );
};