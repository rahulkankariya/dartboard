import { useState, useEffect, useCallback, useRef } from "react";
import { SOCKET_EVENTS } from "@/constants/socket-events";

export const useChat = (socket: any, activeUser: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. RESTORED SEND MESSAGE LOGIC ---
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || !socket || !activeUser) return;

      // A. Send the actual message
      socket.emit(SOCKET_EVENTS.SEND_MESSAGE, {
        receiverId: activeUser._id,
        content: content.trim(),
        type: 1, // Represents MESSAGE_TYPES.TEXT
      });
      socket.emit(SOCKET_EVENTS.TYPING_STOP, { receiverId: activeUser._id });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    },
    [socket, activeUser],
  );

  // --- 2. LOAD MORE (Pagination) ---
  const loadMore = useCallback(() => {
    if (
      isLoading ||
      !hasMore ||
      !socket ||
      !activeUser ||
      messages.length === 0
    )
      return;

    setIsLoading(true);
    const nextPage = page + 1;

    socket.emit(SOCKET_EVENTS.REQUEST_MESSAGE_LIST, {
      receiverId: activeUser._id,
      pageIndex: nextPage,
    });
    setPage(nextPage);
  }, [hasMore, isLoading, page, socket, activeUser, messages.length]);

  // --- 3. SOCKET LISTENERS ---
  useEffect(() => {
    if (!socket || !activeUser?._id) return;

    // Reset state for new chat
    setMessages([]);
    setPage(0);
    setHasMore(true);
    setIsLoading(true);

    // Initial Fetch
    socket.emit(SOCKET_EVENTS.REQUEST_MESSAGE_LIST, {
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
          const combined = [...incoming, ...prev];
          // Deduplicate by _id
          return Array.from(new Map(combined.map((m) => [m._id, m])).values());
        });
      }
      setIsLoading(false);
    };

    const handleNewMessage = (msg: any) => {
 
      // 1. Identify Sender safely
      const senderId =
        typeof msg.sender === "object" ? msg.sender._id : msg.sender;

      // 2. Identify Receiver from readStatus
      // (In your JSON, the second element in readStatus is usually the recipient)
      const receiverId = msg.readStatus?.find(
        (status: any) => status.user !== senderId,
      )?.user;

      // 3. Relevance Check
      // The message is relevant if the sender is the person I'm talking to (Incoming)
      // OR if I sent the message to the person I'm talking to (Outgoing)
      const isRelevant =
        senderId === activeUser?._id || receiverId === activeUser?._id;

      if (isRelevant) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });

        // 4. Auto-Read Emission
        if (senderId === activeUser?._id) {
          socket.emit(SOCKET_EVENTS.MARK_CHAT_READ, {
            senderId: activeUser._id,
            chatId: msg.chatId, // Passing chatId helps the backend find the record faster
          });
        }
      }
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
