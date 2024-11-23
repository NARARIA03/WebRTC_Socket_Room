module.exports = socketHandler = (io) => {
  // key: roomName, value: socket.data.id 집합 형태로 관리
  const rooms = new Map();
  const chats = new Map();

  io.on("connection", (socket) => {
    socket.data = { userId: socket.handshake.query.userId };
    console.log("새로운 사용자 연결:", socket.data.userId);

    // 특정 유저가 특정 방에 채팅을 전송하면
    // 이를 받아서 Map을 업데이트하고 chat 이벤트를 해당 방에 발사
    socket.on("send-chat", (chat, roomName) => {
      const updatedChat = chats.has(roomName)
        ? [...chats.get(roomName), chat]
        : [chat];

      chats.set(roomName, updatedChat);
      io.to(roomName).emit("recv-chat", chats.get(roomName));
    });

    socket.on("join-room", (roomName) => {
      // 해당 room에 최대 3명만 들어올 수 있도록 처리
      if (rooms.has(roomName)) {
        const length = rooms.get(roomName).size;
        if (length === 3) {
          socket.emit("room-full"); // 프론트가 이 이벤트를 수신하면, alert를 띄워서 안내
          return;
        }
        // 기존 방에 입장
        rooms.get(roomName).set(socket.id, socket.data.userId);
      } else {
        // 새 방을 생성하고 입장
        rooms.set(roomName, new Map());
        rooms.get(roomName).set(socket.id, socket.data.userId);
      }
      console.log(rooms);
      // 소켓 room 연결
      socket.join(roomName);
      // 새로 들어온 유저에게 기존 채팅 내역 전달
      socket.emit("recv-chat", chats.get(roomName) || []);

      // 본인 제외 같은 room의 peerId와 userId를 all-users 이벤트로 새로 들어온 유저에게 쏴줌
      // [ 이후 흐름! ]
      // all-users 이벤트를 수신하면, 새로 들어온 유저는 기존 유저들에게 떡(offer)를 돌리기 시작
      // 기존 유저들이 떡을 받으면(recv-offer) 칭찬을 해줌(send-answer)
      // 새로 들어온 유저가 칭찬을 받으면 (recv-answer) ... 부터 잘 이해가 안된듯 다시공부
      const remoteUsers = [...rooms.get(roomName).entries()]
        .filter(([peerId]) => peerId !== socket.id)
        .map(([peerId, userId]) => ({
          remotePeerId: peerId,
          remoteUserId: userId,
        }));

      socket.emit("all-users", remoteUsers);
    });

    // offer를 만들어서 receiverPeerId에 해당하는 socket.id에게 sdp를 전달. (새로 들어온 사람이 수행)
    // all-users 이벤트를 수신한 쪽에서 all-users에 담긴 모든 유저에 대해 createPeer를 수행하는데,
    // 이 때 한명한명마다 offer를 만들어서 전달.
    // 누가 전달한지(socket.id, senderUserId)도 함께 보냄.
    socket.on("send-offer", (receiverPeerId, senderUserId, offer) => {
      io.to(receiverPeerId).emit("recv-offer", socket.id, senderUserId, offer);
    });

    // answer를 만들어서 receiverPeerId에 해당하는 socket.id에게 sdp를 전달, (기존에 있던 사람이 수행)
    // 역시 누가 전달한지(socket.id)도 함께 보냄
    socket.on("send-answer", (receiverPeerId, answer) => {
      io.to(receiverPeerId).emit("recv-answer", socket.id, answer);
    });

    // 이부분을 이해 못 해서 많이 해멨음
    // 기본적으로 위 주석을 보면, send-answer는 기존에 있던 유저들이 새 유저를 칭찬해주는거고
    // send-offer는 입장한 사람이 기존 유저들한테 떡을 돌리는거임
    // 프론트에서 이 두 입장에 대한 함수가 있는데 (addPeer, createPeer) 두 함수 내에서
    // RTCPeerConnection 객체의 onicecandidate 이벤트 핸들러 내에서 호출하는 이벤트가 된다.
    // ice 가능한게 생기면 바로바로 서로에게 쏴주는 역할?
    socket.on("send-ice-candidate", (receiverPeerId, candidate) => {
      io.to(receiverPeerId).emit("recv-ice-candidate", socket.id, candidate);
    });

    // 소켓 연결 끊기 위한거, 소켓 알면 별다른건 없음
    socket.on("disconnect", () => {
      rooms.forEach((roomMap, roomName) => {
        if (roomMap.has(socket.id)) {
          roomMap.delete(socket.id);
          if (roomMap.size === 0) {
            rooms.delete(roomName);
            chats.delete(roomName);
          } else {
            // 룸에 사용자 남아 있으면 알림
            io.to(roomName).emit("user-leave", socket.id);
          }
          console.log("사용자 연결 해제:", socket.id);
          console.log(rooms);
          console.log(chats);
        }
      });
    });
  });
};
