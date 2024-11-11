const express = require("express");
const cors = require("cors");

const userRouter = require("./routers/userRouter");

const app = express();
app.set("port", 3001);

app.use(cors());

// body json parser 연결
app.use(express.json());

// 로그인, 회원가입 관련 라우터 연결
app.use("/user", userRouter);

/**
 * @description 없는 엔드포인트에 요청을 날리면 404 Not Found를 전송. 최하단에 위치해야 함
 */
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

app.listen(app.get("port"), () => {
  console.log(`${app.get("port")}번 포트에서 대기중`);
});
