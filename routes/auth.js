const { Router } = require("express");
const { User, Token, Asset } = require("../sequelize");
const jwt = require("jsonwebtoken");
const {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  sendAuthResponse,
  sendUnauthResponse,
  sendExpiredResponse,
  sendErrorResponse,
} = require("./utils/jwt");

const router = Router();

router.get("/slient-refresh", function (req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return sendExpiredResponse(res);
  try {
    const decoded = verifyToken(refreshToken);

    Token.findByPk(refreshToken).then((row) => {
      const { USER_ID } = row.dataValues;
      User.findByPk(USER_ID).then((row) => {
        const { USER_ID, EMAIL, PRF_IMG, NK } = row.dataValues;

        // accessToken 발급
        const payload = { email: EMAIL, nickname: NK };
        const accessToken = signAccessToken(payload);
        return sendAuthResponse(res, accessToken, refreshToken);
      });
    });
  } catch (error) {
    console.log("만료");
    Token.destroy({
      where: {
        RFS_TK: refreshToken,
      },
    }).then(function () {
      return sendExpiredResponse(res);
    });
  }
});

router.post("/login", function (req, res) {
  const { email, name } = req.body;

  // 로그인 시도하는 계정의 기존 회원 유무 판단
  User.findOne({
    where: {
      EMAIL: email,
    },
  }).then((row) => {
    if (!row) {
      // 신규 가입
      User.create({
        EMAIL: email,
        NK: name,
        JN_DT: new Date(),
      }).then((row) => {
        const { USER_ID } = row.dataValues;
        Asset.create({
          ASS_ID: `${USER_ID}_cash`,
          USER_ID: USER_ID,
          TRS_TP: "CASH",
          TRS_NM: "현금",
          PRC: 1000000,
          CNT: 1,
        });
      });
    } else {
      // 기존 회원
      const { USER_ID, EMAIL, PRF_IMG, NK } = row.dataValues;

      try {
        // 각 토큰 발급
        const payload = { email: EMAIL, nickname: NK };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken();

        // refreshToken DB에 추가
        Token.create({
          RFS_TK: refreshToken,
          USER_ID: USER_ID,
        });

        return sendAuthResponse(res, accessToken, refreshToken);
      } catch (error) {
        console.error(error);
        return sendErrorResponse(res);
      }
    }
  });
});

router.post("/logout", function (req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return sendExpiredResponse(res);
  Token.destroy({
    where: {
      RFS_TK: refreshToken,
    },
  }).then(function () {
    return sendUnauthResponse(res);
  });
});

module.exports = router;
