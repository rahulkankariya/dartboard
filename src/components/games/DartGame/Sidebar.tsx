import { Shot } from './types';

export const Sidebar = ({ history }: { history: Shot[] }) => (
  <aside className="w-80 p-8 border-r border-white/5 bg-black/90 z-1001 flex flex-col h-full">
    <h2 className="text-[10px] text-amber-500 font-black uppercase tracking-[0.4em] mb-4">
      Result Data
    </h2>
    
    <div className="grow overflow-y-auto space-y-3 custom-scrollbar pr-2">
      {history.length === 0 ? (
        <div className="text-stone-600 text-[10px] uppercase italic text-center mt-10">
          Waiting for impact...
        </div>
      ) : (
        history.map((shot) => (
          <div 
            key={shot.id} 
            className="p-4 bg-white/5 border border-white/10 flex justify-between items-center hover:border-amber-500/30 transition-all group relative overflow-hidden"
          >
            {/* Background Glow Effect on Hover */}
            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10 flex flex-col">
              <span className="text-amber-500 font-black text-lg group-hover:translate-x-1 transition-transform">
                {shot.label}
              </span>
              
              {/* DISPLAYING COORDINATES */}
              {shot.coords && (
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[9px] text-amber-500/50 font-black uppercase">Loc:</span>
                  <span className="text-[10px] font-mono text-stone-500 tracking-tighter">
                    {shot.coords}
                  </span>
                </div>
              )}
            </div>

            <div className="relative z-10 flex flex-col items-end">
              <span className="text-2xl font-mono text-stone-300">
                +{shot.points}
              </span>
              <span className="text-[8px] text-stone-600 uppercase font-bold">Points</span>
            </div>
          </div>
        ))
      )}
    </div>
    
    {/* Bottom Stats Footer (Optional) */}
    <div className="mt-4 pt-4 border-t border-white/5 text-[9px] text-stone-600 font-mono">
      SYSTEM STATUS: ACTIVE // GRID_SYNC: OK
    </div>
  </aside>
);