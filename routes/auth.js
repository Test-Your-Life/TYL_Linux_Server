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
const db = require("./utils/db");

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

router.post("/login", async function (req, res) {
  const { email, name } = req.body;
  let user = await db.getUserByEmail(email);

  if (!user) user = await db.createNewUser(email, name);

  try {
    const { USER_ID, EMAIL, PRF_IMG, NK } = user;
    const payload = { email: EMAIL, nickname: NK };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken();

    Token.create({
      RFS_TK: refreshToken,
      USER_ID: USER_ID,
    });

    return sendAuthResponse(res, accessToken, refreshToken);
  } catch (error) {
    console.error(error);
    return sendErrorResponse(res);
  }
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
