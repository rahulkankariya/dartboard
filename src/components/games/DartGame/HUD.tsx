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
    <div className="grid grid-cols-3 gap-2 md:gap-6 w-full max-w-4xl mb-4 md:mb-8">
      <StatBox
        label="AGGREGATE"
        value={score.toString().padStart(3, "0")}
        color="text-red-600"
      />
      <StatBox label="IMPACT" value={lastHit} color="text-amber-500" />
      <StatBox
        label="MISSION CLOCK"
        value={formatTime(seconds)}
        color="text-cyan-500"
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
  <div className="text-center bg-black/40 border border-white/5 p-2 md:p-4 shadow-xl">
    <p className="text-[7px] md:text-[10px] text-stone-500 font-black tracking-widest uppercase mb-1 truncate">
      {label}
    </p>
    <div className={`text-sm md:text-4xl font-mono truncate transition-colors ${color}`}>
      {value}
    </div>
  </div>
);