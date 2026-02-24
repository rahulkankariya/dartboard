import React from 'react';
import { Position } from './types';

export const Crosshair = ({ pos }: { pos: Position }) => (
  <>
    <div 
      className="fixed w-15 h-15 z-6000 pointer-events-none flex items-center justify-center transition-transform duration-75"
      style={{ left: `${pos.x + pos.swayX - 30}px`, top: `${pos.y + pos.swayY - 30}px` }}
    >
      <div className="absolute inset-0 border border-amber-500/20 rounded-full animate-pulse"></div>
      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_#f59e0b]"></div>
    </div>
    <div 
      className="fixed pointer-events-none z-5000 opacity-80"
      style={{ left: `${pos.x + pos.swayX - 16}px`, top: `${pos.y + pos.swayY + 60}px` }}
    >
      <div className="w-10 h-80 bg-linear-to-b from-stone-400 via-stone-800 to-black rounded-full shadow-2xl" />
    </div>
  </>
);