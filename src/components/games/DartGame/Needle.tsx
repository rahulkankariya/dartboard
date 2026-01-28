"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { PlacedDart } from './types';

export const Needle = ({ x, y, label }: PlacedDart) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);

  const tilt = useMemo(() => Math.random() * 10 - 5, []);

  if (!hasMounted) return null;

  return (
    <div 
      className="absolute z-50 pointer-events-none"
      style={{ 
        left: `${x}%`, 
        top: `${y}%`, 
        transform: `translate(-50%, -100%) rotate(${tilt}deg)`,
        animation: 'dart-land 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
      }}
    >
      <div className="flex flex-col items-center">
        
        {/* 1. TIRANGA FLIGHT (Indian Flag Design) */}
        {/* mb-[-16px] -> -mb-4 */}
        <div className="relative w-12 h-14 -mb-4 filter drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
           <div 
            className="absolute inset-0 flex flex-col overflow-hidden" 
            style={{ 
              clipPath: "polygon(50% 0%, 100% 20%, 100% 80%, 50% 100%, 0% 80%, 0% 20%)", 
              border: '1px solid rgba(255,255,255,0.2)'
            }} 
          >
             <div className="flex-1 bg-[#FF9933]" />
             {/* border-[1px] -> border */}
             <div className="flex-1 bg-white flex items-center justify-center relative">
               <div className="w-3 h-3 border border-blue-900 rounded-full flex items-center justify-center">
                 {/* w-[1px] -> w-px */}
                 <div className="w-px h-full bg-blue-900 absolute rotate-45 opacity-20" />
                 <div className="w-px h-full bg-blue-900 absolute -rotate-45 opacity-20" />
               </div>
             </div>
             <div className="flex-1 bg-[#138808]" />
           </div>
        </div>

        {/* 2. METALLIC BARREL */}
        {/* bg-gradient-to-b -> bg-linear-to-b (Tailwind v4 style) or stay gradient-to-b for v3 */}
        <div className="relative w-4 h-14 bg-linear-to-b from-zinc-400 via-zinc-100 to-zinc-700 rounded-sm shadow-xl flex items-center justify-center border-x border-white/20">
          {label && (
            <span className="text-[#22c55e] font-black text-[14px] drop-shadow-[0_1px_2px_rgba(0,0,0,1)] z-10">
              {label}
            </span>
          )}
          {/* h-[1px] -> h-px */}
          <div className="absolute inset-0 flex flex-col justify-around py-2 opacity-30">
            <div className="h-px bg-black w-full" />
            <div className="h-px bg-black w-full" />
            <div className="h-px bg-black w-full" />
          </div>
        </div>

        {/* 3. ROYAL BLUE PINNED POINT */}
        {/* w-[2px] -> w-0.5 */}
        <div className="w-0.5 h-6 bg-[#1e40af] shadow-[0_0_8px_rgba(30,64,175,0.6)] rounded-b-full" />
        
        {/* 4. IMPACT SHADOW */}
        <div className="absolute bottom-0 w-4 h-1.5 bg-black/60 blur-[1.5px] rounded-full translate-y-0.5" />
      </div>

      <style jsx>{`
        @keyframes dart-land {
          0% { transform: translate(-50%, -400%) rotate(40deg) scale(2); opacity: 0; }
          100% { transform: translate(-50%, -100%) rotate(${tilt}deg) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};