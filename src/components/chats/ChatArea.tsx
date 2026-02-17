"use client";
import { useState, useEffect, useRef } from "react";
import { useSocket } from "@/context/SocketContext";
import { SOCKET_EVENTS } from "@/constants/socket-events";
import { User } from "@/types/chat";
import { Send, Check } from "lucide-react";

export default function ChatArea({ activeUser }: { activeUser: User | null }) {
  const { socket } = useSocket();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket || !activeUser) return;

    // Reset messages when user changes
    setMessages([]);

    // 1. Fetch History
    socket.emit(SOCKET_EVENTS.REQUEST_CHAT_HISTORY, {
      receiverId: activeUser._id,
      pageIndex: 0,
    });

    // 2. Event Handlers
    const handleHistory = (response: any) => {
      if (response.status === 200 && response.receiverId === activeUser._id) {
        const incomingMessages = response?.messageList ?? [];
        if (Array.isArray(incomingMessages)) {
          setMessages([...incomingMessages].reverse());
        }
      }
    };

    const handleNewMessage = (newMessage: any) => {
      setMessages((prev) => {
        // Prevent duplicates
        if (prev.find((m) => m._id === newMessage._id)) return prev;

        const mSenderId = newMessage.sender?._id || newMessage.sender;
        const isFromActive = String(mSenderId) === String(activeUser._id);
        const isFromMe = String(mSenderId) !== String(activeUser._id);

        if (isFromActive || isFromMe) {
          // If I am receiving a message right now, tell server I've read it
          if (isFromActive) {
            socket.emit(SOCKET_EVENTS.MARK_MESSAGE_READ, {
              messageId: newMessage._id,
              senderId: mSenderId
            });
          }
          return [...prev, newMessage];
        }
        return prev;
      });
    };

    const handleStatusUpdate = (data: { messageId: string, status: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === data.messageId ? { ...m, status: data.status } : m
        )
      );
    };

    // 3. Set up Listeners
    socket.on(SOCKET_EVENTS.RESPONSE_MESSAGE_LIST, handleHistory);
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_SENT_SUCCESS, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, handleStatusUpdate);

    // 4. Cleanup
    return () => {
      socket.off(SOCKET_EVENTS.RESPONSE_MESSAGE_LIST, handleHistory);
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_SENT_SUCCESS, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, handleStatusUpdate);
    };
  }, [socket, activeUser]);

  // Auto-scroll logic
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket || !activeUser) return;

    const payload = {
      receiverId: activeUser._id,
      content: input,
      type: 1,
    };

    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, payload);
    setInput("");
  };

  if (!activeUser) return <EmptyState />;

  return (
    <div className="flex-1 flex flex-col h-full bg-app-bg">
      {/* Header */}
      <div className="p-4 border-b border-app-border flex items-center justify-between">
        <h2 className="text-sm font-bold text-app-accent uppercase tracking-widest">
          {activeUser.fullName}
        </h2>
        <span className="text-[10px] opacity-40">● Online</span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {messages.map((m, i) => {
          const mSenderId = m.sender?._id || m.sender;
          const isOwn = String(mSenderId) !== String(activeUser._id);
          const isRead = m.status === "read" || m.isRead === true;

          return (
            <div key={m._id || i} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-xl max-w-[75%] text-sm relative ${
                isOwn ? "bg-app-accent text-white" : "bg-app-text/10 text-app-text"
              }`}>
                {m.content}
                
                <div className="flex items-center justify-end gap-1 mt-1">
                  <p className="text-[8px] opacity-60">
                    {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                  
                  {isOwn && (
                    <div className="flex items-center ml-1">
                      {isRead ? (
                        <div className="flex -space-x-1.5">
                          <Check size={11} strokeWidth={3} className="text-blue-400" />
                          <Check size={11} strokeWidth={3} className="text-blue-400" />
                        </div>
                      ) : (
                        <Check size={11} strokeWidth={2} className="text-white/50" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Footer Input */}
      <div className="p-4 border-t border-app-border bg-app-bg flex gap-2">
        <input 
          className="flex-1 bg-app-text/5 border border-app-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-app-accent text-app-text"
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