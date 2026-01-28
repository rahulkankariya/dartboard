"use client";
import React, { useState, useEffect } from "react";

interface HUDProps {
  score: number;
  lastHit: string;
  dartsThrown: number;
}

export const HUD = ({ score, lastHit, dartsThrown }: HUDProps) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 w-full max-w-4xl mb-4 md:mb-8">
      <StatBox
        label="AGGREGATE"
        value={score.toString().padStart(3, "0")}
        // Using accent color for primary stat
        color="text-app-accent"
      />
      <StatBox 
        label="IMPACT" 
        value={lastHit} 
        color="text-app-text" 
      />
      <StatBox
        label="MISSION CLOCK"
        value={formatTime(seconds)}
        // Using dimmed text color for secondary info
        color="text-app-text/60"
      />
    </div>
  );
};

const StatBox = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => (
  /* Removed bg-black/40 and border-white/5 for theme variables */
  <div className="text-center bg-app-text/3 border border-app-border p-2 md:p-5 backdrop-blur-sm relative overflow-hidden">
    {/* Subtle decorative corner accent */}
    <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-app-accent/40" />
    
    <p className="text-[7px] md:text-[9px] text-app-text/40 font-black tracking-[0.2em] uppercase mb-1 truncate">
      {label}
    </p>
    <div className={`text-base md:text-3xl font-mono truncate transition-all duration-500 ${color}`}>
      {value}
    </div>
  </div>
);