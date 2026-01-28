import { useState, useEffect } from 'react';
import { Position } from './types';

export const useSway = () => {
  const [pos, setPos] = useState<Position>({ x: 0, y: 0, swayX: 0, swayY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const time = performance.now();
      setPos({
        x: e.clientX,
        y: e.clientY,
        swayX: Math.sin(time / 400) * 12,
        swayY: Math.cos(time / 600) * 8
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return pos;
};