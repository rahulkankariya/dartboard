"use client";
import { memo, useState, useRef } from "react";
import { Check, FileText, Play, Pause, Mic } from "lucide-react";
import { MESSAGE_TYPES } from "@/constants/chat";

interface MessageItemProps {
  msg: any;
  isOwn: boolean;
  activeUserId: string;
}

const MessageItem = memo(({ msg, isOwn, activeUserId }: MessageItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const THEME_COLOR = "#D97707"; 

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleSpeed = () => {
    const speeds = [0.25,0.5, 1, 1.5, 2, 2.5, 3];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const nextSpeed = speeds[nextIndex];
    setSpeed(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedValue = (x / rect.width) * duration;
      audioRef.current.currentTime = clickedValue;
    }
  };

  const formatAudioTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const recipientStatus = msg.readStatus?.find(
    (status: any) => String(status.user) === String(activeUserId)
  );
  const isRead = msg.status === "seen" || !!recipientStatus?.readAt;
  const isDelivered = msg.status === "seen" || msg.status === "delivered" || !!recipientStatus?.deliveredAt;

  const formatTime = (dateString?: string) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderContent = () => {
    switch (msg.messageType) {
      case MESSAGE_TYPES.IMAGE:
        return (
          <div className="rounded-lg overflow-hidden mb-1">
            <img src={msg.content} alt="Shared" className="max-w-full h-auto object-cover cursor-pointer hover:opacity-95" />
          </div>
        );

      case MESSAGE_TYPES.AUDIO:
        return (
          <div className="flex items-center gap-2 min-w-55 max-w-full py-1">
            <div className="relative shrink-0">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOwn ? 'bg-black/20' : 'bg-gray-200'}`}>
                 <Mic size={20} className="text-white" />
               </div>
               <button 
                onClick={togglePlay}
                className={`absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform z-10`}
                style={{ color: isOwn ? THEME_COLOR : '#666' }}
               >
                 {isPlaying ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" className="ml-0.5" />}
               </button>
            </div>

            <div className="flex flex-col flex-1 min-w-0 gap-1">
              {/* Progress Bar */}
              <div ref={progressBarRef} onClick={handleSeek} className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer">
                <div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full" 
                  style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                />
              </div>

              <div className="flex justify-between items-center leading-none">
                {/* Timer in White */}
                <span className={`text-[10px] font-medium ${isOwn ? 'text-white' : 'text-gray-500'}`}>
                  {formatAudioTime(isPlaying ? currentTime : duration)}
                </span>
                {/* Speed Toggle in White for Own messages */}
                <button 
                  onClick={toggleSpeed}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors border min-w-7 ${
                    isOwn 
                    ? 'bg-white/20 text-white border-white/40 hover:bg-white/30' 
                    : 'bg-black/5 text-gray-600 border-black/10 hover:bg-black/10'
                  }`}
                >
                  {speed}x
                </button>
              </div>
            </div>

            <audio ref={audioRef} src={msg.content} onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)} onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)} onEnded={() => setIsPlaying(false)} className="hidden" />
          </div>
        );

      case MESSAGE_TYPES.FILE:
        return (
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${isOwn ? "border-white/20 bg-white/10" : "border-gray-200 bg-gray-50"}`}>
            <div className="p-2 rounded-lg bg-white" style={{ color: THEME_COLOR }}>
              <FileText size={20} />
            </div>
            <div className="flex flex-col overflow-hidden text-white">
              <span className="text-xs font-medium truncate">Document Shared</span>
            </div>
          </div>
        );

      case MESSAGE_TYPES.TEXT:
      default:
        return <p className="text-[14.5px] leading-relaxed whitespace-pre-wrap wrap-break-word">{msg.content}</p>;
    }
  };

  return (
    <div className={`flex w-full mb-1 ${isOwn ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1 duration-200`}>
      <div className={`relative px-3 py-2 rounded-xl max-w-[85%] lg:max-w-[75%] shadow-sm ${
          isOwn 
            ? "text-white rounded-tr-none" 
            : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
        }`}
        style={isOwn ? { backgroundColor: THEME_COLOR } : {}}
      >
        {renderContent()}

        <div className={`flex items-center justify-end gap-1 mt-0.5 select-none ${isOwn ? 'text-white/80' : 'opacity-60'}`}>
          <span className="text-[9px]">{formatTime(msg.createdAt)}</span>
          {isOwn && (
            <div className="flex items-center">
              {isRead ? (
                <div className="flex -space-x-1.5">
                  <Check size={12} className="text-white" strokeWidth={4} />
                  <Check size={12} className="text-white" strokeWidth={4} />
                </div>
              ) : (
                <Check size={12} className={isDelivered ? "text-white/70" : "text-white/40"} strokeWidth={3} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";
export default MessageItem;