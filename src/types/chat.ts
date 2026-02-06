export interface Message {
  text: string;
  sender: string;
  time: string;
  own?: boolean;
}

export interface User {
  _id: string;
  fullName: string;
  lastMessage: string;
  lastMessageTime:string
  status: "online" | "offline";
}