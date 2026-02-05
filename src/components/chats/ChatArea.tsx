"use client";
import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { SOCKET_EVENTS } from "@/constants/socket-events";
import { Message, User } from "@/types/chat";
import { Send } from "lucide-react";

export default function ChatArea({ activeUser }: { activeUser: User | null }) {
  const { socket } = useSocket();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    // Centralized event listener
    const onReceive = (data: Message) => {
      setMessages((prev) => [...prev, { ...data, own: false }]);
    };

    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, onReceive);
    
    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, onReceive);
    };
  }, [socket]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;

    const payload: Message = {
      text: input,
      sender: "Me",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
    setMessages((prev) => [...prev, { ...payload, own: true }]);
    setInput("");
  };

  if (!activeUser) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.own ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-xl max-w-[75%] text-sm ${
              m.own ? "bg-app-accent text-white" : "bg-app-text/10 text-app-text"
            }`}>
              {m.text}
              <p className="text-[8px] mt-1 opacity-60 text-right">{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-app-border bg-app-bg flex gap-2">
        <input 
          className="flex-1 bg-app-text/5 border border-app-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-app-accent"
          placeholder="Type transmission..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="p-2 bg-app-accent text-white rounded-lg hover:opacity-90 transition-opacity">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-app-bg/50">
      <div className="h-12 w-12 rounded-full border-2 border-dashed border-app-accent/30 animate-spin mb-4" />
      <p className="text-[10px] uppercase tracking-[0.4em] text-app-text/30 font-bold">Waiting for Protocol Selection</p>
    </div>
  );
}