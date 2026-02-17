import { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (content: string) => void;
  placeholder: string;
}

export default function MessageInput({ onSend, placeholder }: Props) {
  const [input, setInput] = useState("");

  const handleAction = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 border-t border-app-border bg-app-bg flex gap-2">
      <input 
        className="flex-1 bg-app-text/5 border border-app-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-app-accent text-app-text transition-colors"
        placeholder={placeholder}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAction()}
      />
      <button 
        onClick={handleAction} 
        disabled={!input.trim()}
        className="p-2 bg-app-accent text-white rounded-lg hover:opacity-90 disabled:opacity-20 transition-all active:scale-95"
      >
        <Send size={18} />
      </button>
    </div>
  );
}