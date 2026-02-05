import { GameMode } from "app/dashboard/page";

export function ModeSelection({ onSelect }: { onSelect: (m: GameMode) => void }) {
  const modes = ["classic", "rotate", "slide"] as const;
  return (
    <div className="flex-1 border border-dashed border-app-border rounded-lg flex flex-col items-center justify-center bg-app-text/2 backdrop-blur-sm">
      <h3 className="text-app-accent font-serif italic text-3xl mb-8">Protocol Selection</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl px-4">
        {modes.map((m) => (
          <button key={m} onClick={() => onSelect(m)} className="group relative border border-app-accent/20 p-6 uppercase tracking-widest text-[10px] font-black hover:border-app-accent transition-all">
            <span className="relative z-10 group-hover:text-app-bg">{m} Range</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-app-accent transition-transform duration-500" />
          </button>
        ))}
      </div>
    </div>
  );
}