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

  const handleNewDart = (newDart: PlacedDart) => {
    // ... (Your existing logic for points calculation remains identical)
    const centerX = 50;
    const centerY = 50;
    const dx = newDart.x - centerX;
    const dy = newDart.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90 + 9;
    if (angle < 0) angle += 360;
    if (angle >= 360) angle -= 360;

    const DART_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
    const segmentIndex = Math.floor(angle / 18) % 20;
    const baseValue = DART_NUMBERS[segmentIndex];

    let points = 0;
    let labelText = "";
    let finalColor = newDart.color;

    if (distance <= 1.5) {
      points = 50; labelText = "DBL BULL (50)"; finalColor = "#c62828"; 
    } else if (distance <= 4.5) {
      points = 25; labelText = "BULLSEYE (25)"; finalColor = "#2e7d32"; 
    } else if (distance >= 37 && distance <= 40) {
      points = baseValue * 2; labelText = `DBL ${baseValue}`;
    } else if (distance >= 23 && distance <= 28) {
      points = baseValue * 3; labelText = `TRPL ${baseValue}`;
    } else if (distance > 50) {
      points = 0; labelText = "MISS";
    } else {
      points = baseValue; labelText = `SNGL ${baseValue}`;
    }

    const processedDart: PlacedDart = {
      ...newDart,
      id: Date.now().toString(),
      color: finalColor,
      label: darts.length + 1 
    };

    setScore(s => s + points);
    setLastHit(labelText);
    setHistory(prev => [{ id: Date.now(), label: labelText, points, coords: `X:${newDart.x.toFixed(1)} Y:${newDart.y.toFixed(1)}` }, ...prev]);
    setDarts(prev => [...prev, processedDart]);
    setDartsThrown(d => d + 1);
  };

 return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-app-bg lg:cursor-none relative overflow-hidden touch-none transition-colors duration-300">
      
      {/* SIDEBAR: Hidden on very small mobile if needed, but standard for desktop */}
      <div className="order-2 lg:order-1 w-full lg:w-80 h-[35vh] lg:h-full border-t lg:border-t-0 lg:border-r border-app-border bg-app-bg z-10">
        <div className="h-full overflow-y-auto custom-scrollbar">
           <Sidebar history={history} />
        </div>
      </div>
      
      {/* MAIN GAME AREA */}
      <div className="order-1 lg:order-2 flex-1 flex flex-col items-center justify-between lg:justify-center p-4 min-h-0 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(var(--app-text) 1px, transparent 0)', backgroundSize: '40px 40px' }} />

        <HUD score={score} lastHit={lastHit} dartsThrown={dartsThrown} />
        
        {/* THE FIX: 
            1. We use max-h-[calc(100vh-180px)] to account for the HUD and padding.
            2. We use aspect-square and w-auto so it shrinks width-wise if height is the bottleneck.
        */}
        <div className="relative flex-1 flex items-center justify-center w-full min-h-0 mb-4 lg:mb-0">
          <div className="relative aspect-square h-full max-h-[60vh] lg:max-h-[80vh] max-w-full">
            <DartBoard 
              boardRef={boardRef} 
              mode={mode} 
              darts={darts} 
              onDartPlace={handleNewDart} 
            />
          </div>
        </div>
      </div>

    </div>
  );
};