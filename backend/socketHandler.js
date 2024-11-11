module.exports = socketHandler = (io) => {
  io.on("connection", (socket) => {
    // 소켓 연결을 하는 과정에서 (handshake) userId를 받아 미리 저장해둠!
    console.log(`사용자 연결, userId: ${socket.handshake.query.userId}`);
    socket.data = { userId: socket.handshake.query.userId };

    socket.on("disconnect", () => {
      console.log(`사용자 연결 해제, userId: ${socket.data.userId}`);
    });
  });
};
