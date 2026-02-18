import { useState, useEffect, useCallback } from "react";
import { SOCKET_EVENTS } from "@/constants/socket-events";

export const useChat = (socket: any, activeUser: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback((content: string) => {
    if (!content.trim() || !socket || !activeUser) return;
    socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
      receiverId: activeUser._id,
      content,
      type: 1,
    });
  }, [socket, activeUser]);

  const loadMore = useCallback(() => {
    // GUARD: Prevents double-triggering and automatic calls on first load
    if (isLoading || !hasMore || !socket || !activeUser || messages.length === 0) return;
    
    setIsLoading(true);
    const nextPage = page + 1;
    
    socket.emit(SOCKET_EVENTS.REQUEST_CHAT_HISTORY, {
      receiverId: activeUser._id,
      pageIndex: nextPage,
    });
    setPage(nextPage);
  }, [hasMore, isLoading, page, socket, activeUser, messages.length]);

  useEffect(() => {
    if (!socket || !activeUser?._id) return;

    setMessages([]);
    setPage(0);
    setHasMore(true);
    setIsLoading(true);

    // Initial Fetch
    socket.emit(SOCKET_EVENTS.REQUEST_CHAT_HISTORY, {
      receiverId: activeUser._id,
      pageIndex: 0,
    });

    const handleHistory = (response: any) => {
      if (response.status === 200) {
        const incoming = response.messageList || [];
        const pagin = response.pagination;

        if (pagin) {
          setHasMore(pagin.page <= pagin.pages);
        }

        setMessages((prev) => {
          // Merge incoming (older) with prev (newer)
          const combined = [...incoming, ...prev];
          return Array.from(new Map(combined.map(m => [m._id, m])).values());
        });
      }
      setIsLoading(false);
    };

    const handleNewMessage = (msg: any) => {
      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on(SOCKET_EVENTS.RESPONSE_MESSAGE_LIST, handleHistory);
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
    socket.on(SOCKET_EVENTS.MESSAGE_SENT_SUCCESS, handleNewMessage);

    return () => {
      socket.off(SOCKET_EVENTS.RESPONSE_MESSAGE_LIST, handleHistory);
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleNewMessage);
      socket.off(SOCKET_EVENTS.MESSAGE_SENT_SUCCESS, handleNewMessage);
    };
  }, [socket, activeUser?._id]);

  return { messages, sendMessage, loadMore, hasMore, isLoading };
};