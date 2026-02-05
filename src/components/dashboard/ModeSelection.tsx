"use client";

type GameMode = "classic" | "rotate" | "slide";

export function ModeSelection({ onSelect }: { onSelect: (mode: GameMode) => void }) {
  const modes: GameMode[] = ["classic", "rotate", "slide"];

  return (
    <div className="flex-1 border border-dashed border-app-border rounded-lg flex flex-col items-center justify-center bg-app-text/2 backdrop-blur-sm p-4">
      <div className="text-center mb-8">
        <h3 className="text-app-accent font-serif italic text-2xl md:text-3xl mb-1">Protocol Selection</h3>
        <p className="text-[10px] uppercase tracking-[0.5em] opacity-40">Initiate Training</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full max-w-2xl">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => onSelect(mode)}
            className="group relative overflow-hidden border border-app-accent/20 p-4 md:p-6 text-[10px] font-black transition-all hover:border-app-accent text-app-text uppercase tracking-widest"
          >
            <span className="relative z-10 group-hover:text-app-bg transition-colors duration-300">{mode} Range</span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-app-accent transition-transform duration-500 ease-out" />
          </button>
        ))}
      </div>
    </div>
  );
}