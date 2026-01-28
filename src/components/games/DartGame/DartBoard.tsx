import React, { useEffect, useState } from 'react';
import { Needle } from './Needle';
import { PlacedDart } from './types';

const DART_NUMBERS = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

interface DartBoardProps {
  boardRef: React.RefObject<SVGSVGElement>;
  darts: PlacedDart[];
  mode: 'classic' | 'rotate' | 'slide';
  onDartPlace: (dart: PlacedDart) => void;
}

export const DartBoard = ({ boardRef, darts, mode, onDartPlace }: DartBoardProps) => {
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (mode === 'classic') {
      setRotation(0);
      setOffset(0);
      return;
    }
    const interval = setInterval(() => {
      if (mode === 'rotate') setRotation((p) => (p + 1) % 360);
      if (mode === 'slide') setOffset(Math.sin(Date.now() / 500) * 40);
    }, 16);
    return () => clearInterval(interval);
  }, [mode]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();

    // 1. Get click relative to center, removing the 'slide' offset
    const mouseX = e.clientX - rect.left - (mode === 'slide' ? offset : 0);
    const mouseY = e.clientY - rect.top;

    // 2. Convert to 0-100 coordinate system (Numbers, not strings!)
    const xBase = (mouseX / rect.width) * 100;
    const yBase = (mouseY / rect.height) * 100;

    // 3. Reverse the rotation math
    const rad = (-rotation * Math.PI) / 180;
    const dx = xBase - 50;
    const dy = yBase - 50;

    const finalX = 50 + (dx * Math.cos(rad) - dy * Math.sin(rad));
    const finalY = 50 + (dx * Math.sin(rad) + dy * Math.cos(rad));

    onDartPlace({
      id: Date.now().toString(),
      x: finalX,
      y: finalY,
      color: '#ef4444' // Red dart
    });
  };

  return (
    <div className="relative w-full max-w-100 aspect-square mx-auto touch-none select-none">
      {/* Motion Wrapper */}
      <div
        className="relative w-full h-full"
        style={{ transform: `translateX(${offset}px)` }}
        onPointerDown={handlePointerDown}
      >
        <svg
          ref={boardRef}
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Board Background */}
          <circle cx="50" cy="50" r="50" fill="black" />
          
          {/* Segments and Numbers */}
          <g transform="rotate(-9 50 50)">
            {DART_NUMBERS.map((n, i) => {
              const sliceRot = i * 18;
              const isEven = i % 2 === 0;
              const angle = (sliceRot + 9 - 90) * (Math.PI / 180);
              return (
                <g key={i}>
                  <g transform={`rotate(${sliceRot} 50 50)`}>
                    <path d="M50,10 A40,40 0 0,1 62.4,11.8 L61.4,14.8 A37,37 0 0,0 50,13 Z" fill={isEven ? '#2e7d32' : '#c62828'} />
                    <path d="M50,13 A37,37 0 0,1 61.4,14.8 L58.6,23.3 A28,28 0 0,0 50,22 Z" fill={isEven ? '#1a1a1a' : '#f5f5f5'} />
                    <path d="M50,22 A28,28 0 0,1 58.6,23.3 L57.2,27.9 A23,23 0 0,0 50,27 Z" fill={isEven ? '#2e7d32' : '#c62828'} />
                    <path d="M50,27 A23,23 0 0,1 57.2,27.9 L51.5,44 A4.5,4.5 0 0,0 50,44 Z" fill={isEven ? '#1a1a1a' : '#f5f5f5'} />
                  </g>
                  <text 
                    x={50 + Math.cos(angle) * 44} 
                    y={50 + Math.sin(angle) * 44} 
                    fill="white" fontSize="4" fontWeight="bold" textAnchor="middle" dominantBaseline="central"
                    transform={`rotate(${9 + rotation} ${50 + Math.cos(angle) * 44} ${50 + Math.sin(angle) * 44})`}
                  >
                    {n}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Bullseye */}
          <circle cx="50" cy="50" r="4.5" fill="#2e7d32" />
          <circle cx="50" cy="50" r="1.5" fill="#c62828" />
        </svg>

        {/* Darts Layer - Stays aligned with the board */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {darts.map((dart) => (
            <Needle key={dart.id} {...dart} />
          ))}
        </div>
      </div>
    </div>
  );
};