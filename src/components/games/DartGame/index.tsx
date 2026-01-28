"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useSway } from './hooks/useSway';
import { HUD } from './HUD';
import { Sidebar } from './Sidebar';
import { DartBoard } from './DartBoard';
import { Crosshair } from './Crosshair';
import { Shot, PlacedDart } from './types';

export const DartGame = ({ mode }: { mode: 'classic' | 'rotate' | 'slide' }) => {
  const [score, setScore] = useState(0);
  const [dartsThrown, setDartsThrown] = useState(0);
  const [lastHit, setLastHit] = useState("-");
  const [history, setHistory] = useState<Shot[]>([]);
  const [darts, setDarts] = useState<PlacedDart[]>([]);
  
  const pos = useSway();
  const boardRef = useRef<SVGSVGElement>(null!);

  useEffect(() => {
    setScore(0); 
    setDartsThrown(0); 
    setLastHit("-");
    setHistory([]); 
    setDarts([]);
  }, [mode]);

  // This function is called AFTER DartBoard calculates the moving position
const handleNewDart = (newDart: PlacedDart) => {
  const centerX = 50;
  const centerY = 50;
  
  // 1. Calculate distance from center
  const dx = newDart.x - centerX;
  const dy = newDart.y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // 2. Calculate angle 
  // We add 90 to start from the top, and +9 to match the SVG rotation
  let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90 + 9;
  if (angle < 0) angle += 360;
  if (angle >= 360) angle -= 360;

  // 3. Map angle to the dartboard sequence
  const DART_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
  const segmentIndex = Math.floor(angle / 18) % 20;
  const baseValue = DART_NUMBERS[segmentIndex];

  let points = 0;
  let labelText = "";
  let finalColor = newDart.color;

  // 4. Scoring Layers (Distance Logic)
  if (distance <= 1.5) {
    points = 50;
    labelText = "DOUBLE BULL (50)";
    finalColor = "#c62828"; // Red Center
  } else if (distance <= 4.5) {
    points = 25;
    labelText = "BULLSEYE (25)";
    finalColor = "#2e7d32"; // Green Ring
  } else if (distance >= 37 && distance <= 40) {
    points = baseValue * 2;
    labelText = `DOUBLE ${baseValue}`;
  } else if (distance >= 23 && distance <= 28) {
    points = baseValue * 3;
    labelText = `TRIPLE ${baseValue}`;
  } else if (distance > 50) {
    points = 0;
    labelText = "MISS";
  } else {
    // Standard Single Slices
    points = baseValue;
    labelText = `SINGLE ${baseValue}`;
  }

  const coordString = `X:${newDart.x.toFixed(1)} Y:${newDart.y.toFixed(1)}`;
  // 5. Create the updated dart with the Red Number Symbol (label)
  const dartCount = darts.length + 1;
  const processedDart: PlacedDart = {
    ...newDart,
    id: Date.now().toString(),
    color: finalColor,
    label: dartCount // This is the 1, 2, 3 symbol
  };

  // 6. Update State
  setScore(s => s + points);
  setLastHit(labelText);
  setHistory(prev => [{ id: Date.now(), label: labelText, points,coords:coordString }, ...prev]);
  setDarts(prev => [...prev, processedDart]);
  setDartsThrown(d => d + 1);
};

  return (
    <div className="flex w-full h-full bg-slate-50 dark:bg-[#050505] cursor-none relative overflow-hidden">
      <Crosshair pos={pos} />
      <Sidebar history={history} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <HUD score={score} lastHit={lastHit} dartsThrown={dartsThrown} />
        
        <DartBoard 
          boardRef={boardRef} 
          mode={mode} 
          darts={darts} 
          onDartPlace={handleNewDart} // This handles the state update
        />
      </div>
    </div>
  );
};