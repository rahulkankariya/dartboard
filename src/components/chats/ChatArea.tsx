"use client";
import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { SOCKET_EVENTS } from "@/constants/socket-events";
import { User } from "@/types/chat";
import { Send } from "lucide-react";

export default function ChatArea({ activeUser }: { activeUser: User | null }) {
  const { socket } = useSocket();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !activeUser) return;

    setMessages([]);

    // 1. Request Chat History
    socket.emit("request-chat-history", { 
      chatId: activeUser._id, 
      pageIndex: 0,
      pageSize: 50 
    });

    // 2. Handle History Response with Defensive Logic
    const handleHistory = (response: any) => {
      console.log("Chat History Response:", response); // Debugging

      if (response.status === 200 && response.chatId === activeUser._id) {
        /**
         * SAFETY CHECK: 
         * Use Optional Chaining (?.) and nullish coalescing (??) 
         * to ensure we always have an array before calling .reverse()
         */
        const incomingMessages = response?.messageList ?? [];
        
        if (Array.isArray(incomingMessages)) {
          // Spread into a new array [...list] because .reverse() mutates the original
          setMessages([...incomingMessages].reverse());
        } else {
          console.error("Payload 'messageList' is not an array:", incomingMessages);
          setMessages([]);
        }
      }
    };

    const onReceive = (newMessage: any) => {
      // Validate that message belongs to current conversation
      if (newMessage.chatId === activeUser._id || newMessage.sender?._id === activeUser._id) {
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    socket.on("response-message-list", handleHistory);
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, onReceive);
    
    return () => {
      socket.off("response-message-list", handleHistory);
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, onReceive);
    };
  }, [socket, activeUser]);

  useEffect(() => {
    // Small timeout ensures the DOM has rendered the new message before scrolling
    const timer = setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket || !activeUser) return;

    const payload = {
      chatId: activeUser._id, 
      content: input,
      type: 1, 
    };

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
    setInput("");
  };

  if (!activeUser) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg">
      <div className="p-4 border-b border-app-border flex items-center justify-between">
        <h2 className="text-sm font-bold text-app-accent uppercase tracking-widest">
          {activeUser.fullName}
        </h2>
        <span className="text-[10px] opacity-40">● Online</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((m, i) => {
          // Safety check for sender object
          const isOwn = m.sender?._id !== activeUser._id; 
          return (
            <div key={m._id || i} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-xl max-w-[75%] text-sm ${
                isOwn ? "bg-app-accent text-white" : "bg-app-text/10 text-app-text"
              }`}>
                {m.content}
                <p className="text-[8px] mt-1 opacity-60 text-right">
                  {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 border-t border-app-border bg-app-bg flex gap-2">
        <input 
          className="flex-1 bg-app-text/5 border border-app-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-app-accent"
          placeholder={`Signal to ${activeUser.fullName}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="p-2 bg-app-accent text-white rounded-lg hover:opacity-90">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-app-bg/50">
       <div className="relative mb-6">
         <div className="h-16 w-16 rounded-full border-2 border-dashed border-app-accent/20 animate-spin" />
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="h-2 w-2 bg-app-accent rounded-full animate-pulse" />
         </div>
       </div>
       <p className="text-[10px] uppercase tracking-[0.4em] text-app-text/30 font-bold">
         Waiting for Protocol Selection
       </p>
    </div>
  );
}