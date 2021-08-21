const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const accessTokenSigniture = {
  expiresIn: "1m",
  algorithm: "HS256",
  issuer: "TYL",
};
const refreshTokenSigniture = {
  expiresIn: "5m",
  algorithm: "HS256",
  issuer: "TYL",
};
const loginCookieOption = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};
const logoutCookieOption = {
  maxAge: 0,
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

module.exports = {
  signAccessToken: (payload) => jwt.sign(payload, secret, accessTokenSigniture),
  signRefreshToken: () => jwt.sign({}, secret, refreshTokenSigniture),
  verifyToken: (token) => jwt.verify(token, secret),
  sendAuthResponse: (res, accessToken, refreshToken) => {
    res.cookie("refreshToken", refreshToken, loginCookieOption).json({
      code: 200,
      message: "토큰이 발급되었습니다.",
      accessToken,
    });
  },
  sendUnauthResponse: (res) =>
    res.cookie("refreshToken", "", logoutCookieOption).json({
      code: 201,
      message: "토큰이 제거되었습니다.",
    }),
  sendExpiredResponse: (res) =>
    res.cookie("refreshToken", "", logoutCookieOption).json({
      code: 401,
      message: "토큰이 만료되었습니다.",
    }),
  sendErrorResponse: (res) =>
    res.status(500).json({
      code: 500,
      message: "서버 에러",
    }),
};
