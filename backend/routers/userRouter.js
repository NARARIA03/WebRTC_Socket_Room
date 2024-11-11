const express = require("express");
const router = express.Router();
const connection = require("../utils/db"); // MySQL
const { verifyToken, createToken } = require("../utils/token");

/**
 * @description POST: 회원가입 엔드포인트
 */
router.post("/", (req, res, next) => {
  try {
    const { id, pw } = req.body;
    console.log(id, pw);

    if (id && pw) {
      connection.query(
        "INSERT INTO users (id, pw) VALUES (?, ?)",
        [id, pw],
        (queryErr, queryRes) => {
          if (queryErr) {
            console.log(queryErr);
            return res.status(500).send({ msg: "MySQL 에러" });
          }
          console.log(queryRes);
          return res.status(201).send({ msg: "회원가입 성공" });
        }
      );
    } else {
      res.status(400).send({ msg: "회원가입 실패, id나 pw가 잘못 입력됨" });
    }
  } catch (e) {
    console.error(e);
    res.status(500).send({ msg: "기타 오류가 발생했습니다" });
  }
});

/**
 * @description GET: 아이디 중복 검사 엔드포인트
 */
router.get("/id/:id", (req, res, next) => {
  try {
    const id = req.params.id;

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (queryErr, queryRes) => {
        if (queryErr) {
          console.log(queryErr);
          return res.status(500).send({ msg: "MySQL 에러" });
        }
        console.log(queryRes);
        if (queryRes.length > 0) {
          return res.status(409).send({ msg: "이미 존재하는 아이디입니다" });
        } else {
          return res.status(200).send({ msg: "사용 가능한 아이디입니다" });
        }
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).send({ msg: "기타 오류가 발생했습니다" });
  }
});

/**
 * @description POST: 로그인 엔드포인트
 */
router.post("/login", (req, res, next) => {
  try {
    const { id, pw } = req.body;

    connection.query(
      "SELECT * FROM users WHERE id = ?",
      [id],
      (queryErr, queryRes) => {
        if (queryErr) {
          console.log(queryErr);
          return res.status(500).send({ msg: "MySQL 에러", token: "" });
        }
        console.log(queryRes);
        if (queryRes.length > 0 && queryRes[0].pw === pw) {
          // 아이디에 해당하는 행이 존재하고, pw가 사용자 입력과 같다면 로그인 처리
          const token = createToken(id);
          return res.status(200).send({ msg: "로그인 성공", token: token });
        } else if (queryRes.length > 0) {
          // 아이디는 존재하는데, 비밀번호가 다른 경우 비밀번호 틀렸다고 안내
          return res
            .status(400)
            .send({ msg: "비밀번호가 틀렸습니다", token: "" });
        } else {
          // 아이디가 존재하지 않는 경우 아이디 또는 비밀번호가 틀렸다고 안내
          return res
            .status(400)
            .send({ msg: "아이디 또는 비밀번호가 틀렸습니다", token: "" });
        }
      }
    );
  } catch (e) {
    console.error(e);
    res.status(500).send({ msg: "기타 오류가 발생했습니다", token: "" });
  }
});

/**
 * @description DELETE: 회원 탈퇴 엔드포인트 (개인적인 공부 목적으로 추가)
 */
router.delete("/:id", (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(token);

    if (
      !decoded ||
      !decoded.id ||
      !req.params.id ||
      decoded.id !== req.params.id
    ) {
      return res.status(401).send({ msg: "유효하지 않은 요청입니다." });
    }
    connection.query(
      "DELETE FROM users WHERE id = ?",
      [decoded.id],
      (queryErr, queryRes) => {
        if (queryErr) {
          console.log(queryErr);
          return res.status(500).send({ msg: "MySQL 에러" });
        }
        console.log(queryRes);
        return res.status(200).send({ msg: "회원 탈퇴 성공" });
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).send({ msg: "기타 오류가 발생했습니다" });
  }
});

/**
 * @description JWT 토큰을 통한 유저 검증 엔드포인트
 */
router.get("/verify", (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer 제거하고 JWT만 남김
    if (!token)
      return res.status(401).send({ msg: "토큰이 존재하지 않습니다", id: "" });

    const decoded = verifyToken(token);
    console.log("decoded: ", decoded);
    if (!decoded)
      return res.status(401).send({ msg: "토큰이 유효하지 않습니다", id: "" });

    return res.status(200).send({ msg: "토큰이 유효합니다", id: decoded.id });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ msg: "기타 오류가 발생했습니다", id: "" });
  }
});

module.exports = router;
