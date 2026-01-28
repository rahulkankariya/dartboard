// "use client";
// import React, { useState, useEffect, useRef } from 'react';

// interface Shot { id: number; label: string; points: number; }

// export const DartGame = ({ mode }: { mode: 'classic' | 'rotate' | 'slide' }) => {
//   const [score, setScore] = useState(0);
//   const [dartsThrown, setDartsThrown] = useState(0);
//   const [lastHit, setLastHit] = useState("-");
//   const [history, setHistory] = useState<Shot[]>([]);
  
//   const boardRef = useRef<HTMLDivElement>(null);
//   const viewportRef = useRef<HTMLDivElement>(null);
//   const crosshairRef = useRef<HTMLDivElement>(null);
//   const handRef = useRef<HTMLDivElement>(null);

//   const dartNumbers = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

//   // Dynamic Movement and Sway Logic
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       const time = performance.now();
//       const swayX = Math.sin(time / 400) * 12;
//       const swayY = Math.cos(time / 600) * 8;
//       const x = e.clientX + swayX;
//       const y = e.clientY + swayY;

//       if (crosshairRef.current) {
//         crosshairRef.current.style.left = `${x - 30}px`;
//         crosshairRef.current.style.top = `${y - 30}px`;
//       }
//       if (handRef.current) {
//         handRef.current.style.left = `${x - 16}px`;
//         handRef.current.style.top = `${y + 60}px`;
//       }
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   const createNeedle = (x: number, y: number) => {
//     if (!boardRef.current) return;
//     const needle = document.createElement("div");
//     // High Z-index ensures it stays on top of the board
//     needle.className = "absolute z-50 pointer-events-none drop-shadow-[10px_15px_6px_rgba(0,0,0,0.6)]";
    
//     const tilt = Math.random() * 8 - 4;
//     const isRed = dartsThrown % 2 === 0;
//     const color = isRed ? "#bd2026" : "#255a3b";
    
//     needle.style.left = `${x}px`;
//     needle.style.top = `${y}px`;
//     needle.style.transform = `translate(-50%, -90%) rotate(${tilt}deg)`;
    
//     needle.innerHTML = `
//       <div class="flex flex-col items-center">
//         <div class="w-8 h-10 mb-[-10px]" style="clip-path: polygon(50% 100%, 0 0, 100% 0); background: linear-gradient(135deg, ${color}, #000);"></div>
//         <div class="w-1.5 h-12 bg-linear-to-b from-zinc-400 via-zinc-100 to-zinc-600 rounded-full border-x border-white/10 relative">
//            <div class="absolute inset-0 bg-white/5 blur-[1px]"></div>
//         </div>
//         <div class="w-px h-2 bg-zinc-900"></div>
//       </div>
//     `;
//     boardRef.current.appendChild(needle);
//   };

//   const handleThrow = (e: React.MouseEvent) => {
//     if (!boardRef.current || !viewportRef.current) return;
//     const rect = boardRef.current.getBoundingClientRect();
//     const style = window.getComputedStyle(viewportRef.current);
//     const matrix = new DOMMatrix(style.transform);
//     const scale = matrix.a || 1;

//     const time = performance.now();
//     const hitX = (e.clientX + (Math.sin(time / 400) * 12) - rect.left) / scale;
//     const hitY = (e.clientY + (Math.cos(time / 600) * 8) - rect.top) / scale;
//     const dist = Math.sqrt(Math.pow(hitX - 260, 2) + Math.pow(hitY - 260, 2));

//     if (dist < 260) {
//       const angle = (Math.atan2(hitY - 260, hitX - 260) * (180 / Math.PI) + 450 + 9) % 360;
//       let multiplier = 1;
//       let label = "";

//       // Precision Multiplier Logic
//       if (dist <= 11) { setScore(s => s + 50); label = "BULL"; }
//       else if (dist <= 22) { setScore(s => s + 25); label = "OUTER"; }
//       else {
//         const basePts = dartNumbers[Math.floor(angle / 18) % 20];
//         if (dist >= 145 && dist <= 163) { multiplier = 3; label = `T-${basePts}`; }
//         else if (dist >= 242 && dist <= 260) { multiplier = 2; label = `D-${basePts}`; }
//         else { label = basePts.toString(); }
//         setScore(s => s + (basePts * multiplier));
//       }

//       setLastHit(label);
//       setHistory(h => [{ id: Date.now(), label, points: multiplier * (parseInt(label.split('-').pop() || "0") || (label === "BULL" ? 50 : 25)) }, ...h]);
//       createNeedle(hitX, hitY);
//     }
//     setDartsThrown(d => d + 1);
//   };

//   return (
//     <div className="flex w-full h-full bg-[#050505] cursor-none relative overflow-hidden" onMouseDown={handleThrow}>
//       {/* Precision HUD */}
//       <div ref={crosshairRef} className="fixed w-15 h-15 z-[6000] pointer-events-none flex items-center justify-center">
//         <div className="absolute inset-0 border border-amber-500/20 rounded-full animate-pulse"></div>
//         <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_15px_#f59e0b]"></div>
//       </div>

//       <div ref={handRef} className="fixed pointer-events-none z-[5000] opacity-80">
//         <div className="w-10 h-80 bg-linear-to-b from-stone-400 via-stone-800 to-black rounded-full shadow-2xl" />
//       </div>

//       {/* Sidebar Analytics */}
//       <aside className="w-80 p-8 border-r border-white/5 bg-black/90 z-[1001] flex flex-col">
//         <h2 className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em] mb-4">Tactical Data</h2>
//         <div className="grow overflow-y-auto space-y-3 custom-scrollbar">
//           {history.map(shot => (
//             <div key={shot.id} className="p-4 bg-white/5 border border-white/5 flex justify-between items-center hover:border-amber-500/30 transition-all">
//               <span className="text-amber-500 font-black text-lg">{shot.label}</span>
//               <span className="text-2xl font-mono text-stone-400">+{shot.points}</span>
//             </div>
//           ))}
//         </div>
//       </aside>

//       {/* 4-Layer Depth Display */}
//       <div className="grow flex flex-col items-center justify-center p-10" ref={viewportRef}>
//         <div className="flex gap-12 mb-10">
//           <StatBox label="AGGREGATE" value={score.toString().padStart(3, '0')} color="text-red-700" />
//           <StatBox label="LAST IMPACT" value={lastHit} color="text-amber-500" />
//           <StatBox label="AMMO" value={(dartsThrown % 3 || 3).toString()} color="text-stone-500" />
//         </div>

//         {/* Layer 1: The Cabinet Frame */}
//         <div className={`relative w-170 h-170 bg-stone-900 border-10 border-stone-800 rounded-sm shadow-[0_0_100px_black] flex items-center justify-center ${mode === 'slide' ? 'animate-cabinet-slide' : ''}`}>
          
//           {/* Layer 2: The Deep Inset Background */}
//           <div className="absolute w-[94%] h-[94%] bg-black/70 rounded-sm shadow-[inset_0_0_80px_black] overflow-hidden flex items-center justify-center">
            
//             {/* Layer 3: The Board Surround */}
//             <div className={`relative w-140 h-140 rounded-full border-20 border-stone-950 flex items-center justify-center ${mode === 'rotate' ? 'animate-board-rotate' : ''}`}>
              
//               {/* Layer 4: Scoring Surface */}
//               <div 
//                 ref={boardRef}
//                 className="w-130 h-130 rounded-full relative shadow-[0_0_40px_rgba(0,0,0,0.5)]"
//                 style={{ 
//                   background: `conic-gradient(#111 0deg 9deg, #d4cfc3 9deg 27deg, #111 27deg 45deg, #d4cfc3 45deg 63deg, #111 63deg 81deg, #d4cfc3 81deg 99deg, #111 99deg 117deg, #d4cfc3 117deg 135deg, #111 135deg 153deg, #d4cfc3 153deg 171deg, #111 171deg 189deg, #d4cfc3 189deg 207deg, #111 207deg 225deg, #d4cfc3 225deg 243deg, #111 243deg 261deg, #d4cfc3 261deg 279deg, #111 279deg 297deg, #d4cfc3 297deg 315deg, #111 315deg 333deg, #d4cfc3 333deg 351deg, #111 351deg 360deg)` 
//                 }}
//               >
//                 {/* Scoring Wire Spider Overlay */}
//                 <div className="absolute inset-0 rounded-full border border-white/10 mix-blend-overlay"></div>
//                 <div className="absolute inset-0 rounded-full border-18 border-red-950/40 pointer-events-none"></div>
//                 <div className="absolute inset-[150px] rounded-full border-18 border-green-950/40 pointer-events-none"></div>

//                 {/* Segment Labels */}
//                 <div className="absolute inset-0 pointer-events-none z-10">
//                   {dartNumbers.map((n, i) => {
//                     const angle = i * 18 * (Math.PI / 180) - Math.PI / 2;
//                     const x = 260 + 235 * Math.cos(angle) - 20;
//                     const y = 260 + 235 * Math.sin(angle) - 20;
//                     return (
//                       <div key={i} className="absolute w-10 text-center text-xl font-bold text-stone-300 drop-shadow-lg" style={{ left: `${x}px`, top: `${y}px` }}>{n}</div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const StatBox = ({ label, value, color }: any) => (
//   <div className="text-center">
//     <p className="text-[10px] text-stone-600 font-black tracking-[0.3em] mb-2">{label}</p>
//     <div className={`text-5xl font-mono bg-black/60 px-8 py-4 border-b-2 border-white/5 shadow-2xl ${color}`}>
//       {value}
//     </div>
//   </div>
// );