export interface Message {
  text: string;
  sender: string;
  time: string;
  own?: boolean;
}

export interface User {
  id: string;
  name: string;
  lastMsg: string;
  time: string;
  status: "online" | "offline";
}