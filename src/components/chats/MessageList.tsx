"use client";
import { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, activeUser, onLoadMore, hasMore, isLoading }: any) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topObserverRef = useRef<HTMLDivElement>(null);
  
  const isFirstLoadDone = useRef(false);
  const lastScrollHeight = useRef<number>(0);

  // 1. Intersection Observer (Detects scroll to top)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger if sentinel is visible, not loading, and we already have the first page
        if (entry.isIntersecting && hasMore && !isLoading && messages.length > 0) {
          const container = scrollContainerRef.current;
          if (container) {
            // LOCK the current height before we add new messages
            lastScrollHeight.current = container.scrollHeight;
          }
          onLoadMore();
        }
      },
      { threshold: 0, rootMargin: "10px" } 
    );

    if (topObserverRef.current) observer.observe(topObserverRef.current);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, isLoading, messages.length]);

  // 2. Smart Scroll Management
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || messages.length === 0) return;

    // A. If we just loaded history (pagination), adjust scroll to prevent double-call
    if (isFirstLoadDone.current && !isLoading && lastScrollHeight.current > 0) {
      const heightDifference = container.scrollHeight - lastScrollHeight.current;
      if (heightDifference > 0) {
        // Move scroll down so the sentinel is no longer visible
        container.scrollTop = heightDifference;
        lastScrollHeight.current = 0;
        return; 
      }
    }

    // B. If first load or receiving a live message at the bottom, snap to bottom
    const isNearBottom = 
      container.scrollHeight - container.scrollTop - container.clientHeight < 200;

    if (!isFirstLoadDone.current || isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
      isFirstLoadDone.current = true;
    }
  }, [messages, isLoading]);

  // Reset flag when changing chats
  useEffect(() => {
    isFirstLoadDone.current = false;
    lastScrollHeight.current = 0;
  }, [activeUser?._id]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar flex flex-col"
      style={{ overflowAnchor: 'none' }} 
    >
      <div ref={topObserverRef} className="h-1 w-full" />

      {isLoading && messages.length > 0 && (
        <div className="flex justify-center w-full py-2">
          <div className="px-3 py-1 text-xs text-white bg-blue-500 rounded-full animate-pulse">
            Loading...
          </div>
        </div>
      )}

      {messages.map((m: any, i: number) => {
        const senderId = typeof m.sender === "string" ? m.sender : m.sender?._id;
        const isOwn = String(senderId) !== String(activeUser._id);
        return <MessageItem key={m._id || `msg-${i}`} msg={m} isOwn={isOwn} />;
      })}

      <div ref={bottomRef} className="h-1 mt-auto" />
    </div>
  );
}