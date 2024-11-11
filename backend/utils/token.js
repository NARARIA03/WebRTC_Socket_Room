require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * @description token을 입력받으면 유효성을 검사하는 함수
 * @param {string} token
 * @returns {{} | null}
 */
const verifyToken = (token) => {
  if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY 환경 변수 누락");
  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    return decoded;
  } catch (e) {
    return null;
  }
};

/**
 * @description id를 입력받으면 JWT를 생성하는 함수
 * @param {string} id
 * @returns {string | null}
 */
const createToken = (id) => {
  if (!process.env.PRIVATE_KEY) throw new Error("PRIVATE_KEY 환경 변수 누락");
  try {
    const token = jwt.sign({ id: id }, process.env.PRIVATE_KEY, {
      expiresIn: "10m",
      issuer: "chs",
    });
    return token;
  } catch (e) {
    return null;
  }
};

exports.verifyToken = verifyToken;
exports.createToken = createToken;
