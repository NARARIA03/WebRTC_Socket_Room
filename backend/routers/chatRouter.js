const express = require("express");
const router = express.Router();
const { verifyToken } = require("../utils/token");

router.get("/", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .send({ msg: "토큰이 존재하지 않습니다", rooms: [] });

    const decoded = verifyToken(token);
    if (!decoded)
      return res
        .status(401)
        .send({ msg: "토큰이 유효하지 않습니다", rooms: [] });

    const io = req.app.get("io");
    const rooms = io.sockets.adapter.rooms;

    const roomInfo = [];
    rooms.forEach((sockets, roomName) => {
      if (io.sockets.adapter.sids.get(roomName)) return;
      roomInfo.push({ roomName, count: sockets.size });
    });
    console.log(roomInfo);
    return res.status(200).send({ msg: "응답 성공", rooms: roomInfo });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ msg: "서버 문제 발생", rooms: [] });
  }
});

module.exports = router;
