"use client";
import React, { useState, useEffect } from 'react';

interface HUDProps {
  score: number;
  lastHit: string;
  dartsThrown: number;
}

export const HUD = ({ score, lastHit, dartsThrown }: HUDProps) => {
  const [seconds, setSeconds] = useState(0);

  // Infinite timer: calculates every second since the game started
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format seconds into MM:SS
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex gap-12 mb-10">
      <StatBox 
        label="AGGREGATE" 
        value={score.toString().padStart(3, '0')} 
        color="text-red-700" 
      />
      
      <StatBox 
        label="LAST IMPACT" 
        value={lastHit} 
        color="text-amber-500" 
      />

      {/* AMMO replaced by MISSION CLOCK */}
      <StatBox 
        label="MISSION CLOCK" 
        value={formatTime(seconds)} 
        color="text-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
      />
    </div>
  );
};

const StatBox = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="text-center">
    <p className="text-[10px] text-stone-600 font-black tracking-[0.3em] mb-2 uppercase">
      {label}
    </p>
    <div className={`text-5xl font-mono bg-black/60 px-8 py-4 border-b-2 border-white/5 shadow-2xl transition-colors duration-500 ${color}`}>
      {value}
    </div>
  </div>
);