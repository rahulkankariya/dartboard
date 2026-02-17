export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: "connection",
  DISCONNECT: "disconnect",

  // Message events
  SEND_MESSAGE: "send-message",
  RECEIVE_MESSAGE: "receive-message",
  MESSAGE_SENT_SUCCESS: "message-sent-success",
  
  // History and Status events
  REQUEST_CHAT_HISTORY: "request-chat-history",
  RESPONSE_MESSAGE_LIST: "response-message-list",
  MARK_MESSAGE_READ: "mark-message-read",
  MESSAGE_STATUS_UPDATED: "message-status-updated",

  // UI events
  USER_TYPING: "user-typing",
} as const;