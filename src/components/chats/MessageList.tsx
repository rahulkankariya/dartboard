"use client";
import { useRef, useEffect } from "react";
import MessageItem from "./MessageItem";

export default function MessageList({ messages, activeUser, currentUser, onLoadMore, hasMore, isLoading }: any) {
  console.log("MessageList Rendered with messages:", messages, "hasMore:", hasMore, "isLoading:", isLoading);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topObserverRef = useRef<HTMLDivElement>(null);
  
  const isFirstLoadDone = useRef(false);
  const lastScrollHeight = useRef<number>(0);

  // 1. Pagination Logic (Scrolling UP)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isLoading && messages.length > 0) {
          if (scrollContainerRef.current) {
            lastScrollHeight.current = scrollContainerRef.current.scrollHeight;
          }
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (topObserverRef.current) observer.observe(topObserverRef.current);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, isLoading, messages.length]);

  // 2. AUTO-SCROLL LOGIC
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || messages.length === 0) return;

    // A. Handle Pagination (Stay at current message)
    if (isFirstLoadDone.current && !isLoading && lastScrollHeight.current > 0) {
      const delta = container.scrollHeight - lastScrollHeight.current;
      container.scrollTop = delta;
      lastScrollHeight.current = 0;
      return;
    }

    // B. Handle New Messages / Initial Load
    const lastMsg = messages[messages.length - 1];
    const senderId = typeof lastMsg?.sender === "string" ? lastMsg.sender : lastMsg?.sender?._id;
    const iSentThis = currentUser?._id && String(senderId) === String(currentUser._id);
    
    // We increase the threshold to 400px to be more aggressive
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 400;

    if (!isFirstLoadDone.current || iSentThis || isNearBottom) {
      // Force scroll to the very bottom pixel
      const scrollToBottom = () => {
        if (bottomRef.current) {
          bottomRef.current.scrollIntoView({ 
            behavior: isFirstLoadDone.current ? "smooth" : "auto",
            block: "end"
          });
        }
      };

      // Try once immediately, then again after a short delay for rendering
      scrollToBottom();
      const timer = setTimeout(scrollToBottom, 100);
      
      isFirstLoadDone.current = true;
      return () => clearTimeout(timer);
    }
  }, [messages, isLoading, currentUser?._id]);

  // Reset when switching users
  useEffect(() => {
    isFirstLoadDone.current = false;
  }, [activeUser?._id]);

  return (
    <div 
      ref={scrollContainerRef} 
      className="flex-1 overflow-y-auto p-4 custom-scrollbar relative"
      style={{ overflowAnchor: 'none', height: '100%' }}
    >
      {/* Sentinel for Top History */}
      <div ref={topObserverRef} className="h-1 w-full" />
      
      {isLoading && hasMore && (
        <div className="text-center text-xs text-gray-500 py-4 italic animate-pulse">
          Loading messages...
        </div>
      )}

      {/* Message Content Wrapper */}
      <div className="flex flex-col gap-4 min-h-full justify-end">
        {messages.map((m: any, i: number) => {
  // 1. Extract IDs safely
  const messageSenderId = String(m.sender?._id || m.sender || "");
  const currentUserId = String(currentUser?._id || currentUser?.id || "");

  // 2. Log for debugging (Optional, remove after fixing)
  // console.log(`Comparing Message Sender: ${messageSenderId} with Current User: ${currentUserId}`);

  // 3. Strict comparison
  const isOwn = currentUserId !== "" && messageSenderId === currentUserId;

  return (
    <MessageItem 
      key={m._id || i} 
      msg={m} 
      isOwn={isOwn} 
      currentUser={currentUser} // Pass this down to help MessageItem with readStatus
    />
  );
})}
      </div>

      {/* THE ANCHOR: Extra large height ensures it pushes above any input bar overlap */}
      <div ref={bottomRef} className="h- w-full shrink-0" /> 
    </div>
  );
}