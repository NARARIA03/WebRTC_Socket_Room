import { useEffect, useRef } from "react";
import { Socket, io } from "socket.io-client";

/**
 * @description 소켓 연결, 방 연결, 소켓 연결 해제를 처리하는 커스텀 훅
 */
export const useSocket = (id: string, roomName: string) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL, {
      query: {
        userId: id,
      },
    });

    socketRef.current.emit("enterRoom", roomName);

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      socketRef.current = null;
    };
  }, [id, roomName]);

  return socketRef;
};
