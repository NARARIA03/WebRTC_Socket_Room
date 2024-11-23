const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");

const socketHandler = require("./socketHandler");
const userRouter = require("./routers/userRouter");
const chatRouter = require("./routers/chatRouter");

const app = express();
app.set("port", 3002);
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://assignment3.nararia03.duckdns.org",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
socketHandler(io);

app.use("/user", userRouter);
app.use("/chat", chatRouter);

/**
 * @description 없는 엔드포인트에 요청을 날리면 404 Not Found를 전송. 최하단에 위치해야 함
 */
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

server.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트에서 대기중`);
});
