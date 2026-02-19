"use client";
import { useState } from "react";
import { Send, Mic, Square, Trash2 } from "lucide-react";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { toast } from "sonner";

// 1. Defined Props interface
interface Props {
  onSend: (content: string) => void;
  onSendVoice: (blob: Blob) => void;
  placeholder: string;
}

export default function MessageInput({ onSend, onSendVoice, placeholder }: Props) {
  const [input, setInput] = useState("");
  const { isRecording, duration, startRecording, stopRecording } = useVoiceRecorder();

  // 2. Added handleAction function
  const handleAction = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      // 3. Minimum 1-second check
      if (duration < 1) {
        await stopRecording();
        toast.error("Message too short");
        return;
      }

      const blob = await stopRecording();
      if (blob) onSendVoice(blob);
    } else {
      await startRecording();
    }
  };

  const handleCancelRecording = async () => {
    await stopRecording();
    toast.info("Recording discarded");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 border-t border-app-border bg-app-bg flex gap-3 items-center">
      {/* Discard Button */}
      {isRecording && (
        <button 
          onClick={handleCancelRecording}
          className="text-app-text/40 hover:text-rose-500 transition-all p-1"
        >
          <Trash2 size={22} />
        </button>
      )}

      <div className="flex-1 relative flex items-center">
        {isRecording ? (
          <div className="flex-1 flex items-center gap-4 bg-app-text/5 rounded-full px-4 py-2 border border-app-accent/20">
            <span className="text-sm font-mono text-rose-500 animate-pulse flex items-center gap-2">
              <span className="h-2 w-2 bg-rose-500 rounded-full" />
              {formatTime(duration)}
            </span>
            
            {/* Analog Waveform */}
            <div className="flex-1 flex items-end gap-0.75 h-5">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="w-0.75 bg-app-accent rounded-full animate-wave"
                  style={{ 
                    height: `${20 + Math.random() * 80}%`,
                    animationDelay: `${i * 0.1}s` 
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <input
            className="w-full bg-app-text/5 border border-app-border rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-app-accent text-app-text transition-all"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAction()}
          />
        )}
      </div>

      <button
        onClick={input.trim() ? handleAction : handleVoiceToggle}
        className={`p-3 rounded-full transition-all active:scale-90 shadow-sm ${
          isRecording 
            ? "bg-rose-500 text-white animate-pulse" 
            : "bg-app-accent text-white hover:shadow-md"
        }`}
      >
        {input.trim() ? (
          <Send size={20} />
        ) : isRecording ? (
          <Square size={20} fill="currentColor" />
        ) : (
          <Mic size={20} />
        )}
      </button>
    </div>
  );
}