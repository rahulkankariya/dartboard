import { Server as ServerIO } from "socket.io";
import { SOCKET_EVENTS } from "@/constants/socket-events";
import type { NextApiRequest, NextApiResponse } from "next";

export default function SocketHandler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      // Listen for message using constant
      socket.on(SOCKET_EVENTS.SEND_MESSAGE, (data) => {
        // Broadcast to everyone else using constant
        socket.broadcast.emit(SOCKET_EVENTS.RECEIVE_MESSAGE, data);
      });
    });
  }
  res.end();
}