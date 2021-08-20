const { Router } = require("express");
const { User, Token } = require("../sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = Router();

router.post("/slient-refresh", function (req, res) {
  const { refreshToken } = req.cookies;
  const decoded = jwt.decode(refreshToken);
   
  if(decoded === null) {
    return res.json({ code: 401, message: "토큰이 만료되었습니다."});
  }

  Token.findByPk(refreshToken)
  .then((row) => {
    const { USER_ID } = row.dataValues;
    User.findByPk(USER_ID)
    .then((row) => {
      const { USER_ID, EMAIL, PRF_IMG, NK } = row.dataValues;

      try {
        // accessToken 발급
        const payload = { email: EMAIL, nickname: NK };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1m",
          algorithm: "HS256",
          issuer: "TYL",
        });
        return res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          })
          .json({
            code: 200,
            message: "토큰이 발급되었습니다.",
            accessToken,
          });
      } catch (error) {
        console.error(error);
      }
    });
  });
});

router.post("/login", function (req, res) {
  const { email, name } = req.body;
  console.log('쿠키도착!!', req.cookies);

  // 로그인 시도하는 계정의 기존 회원 유무 판단
  User.findAll({
    where: {
      EMAIL: email,
    },
  }).then((rows) => {
    if (rows.length === 0) {
      // 신규 가입
      User.create({
        EMAIL: email,
        NK: name,
        JN_DT: new Date(),
      });
    } else {
      // 기존 회원
      const { USER_ID, EMAIL, PRF_IMG, NK } = rows[0].dataValues;

      try {
        // accessToken 발급
        const payload = { email: EMAIL, nickname: NK };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1m",
          algorithm: "HS256",
          issuer: "TYL",
        });

        // refreshToken 발급
        const refreshToken = jwt.sign({}, process.env.JWT_SECRET, {
          expiresIn: "5m",
          algorithm: "HS256",
          issuer: "TYL",
        });

        // refreshToken DB에 추가
        Token.create({
          RFS_TK: refreshToken,
          USER_ID: USER_ID,
        });

  
        return res
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
          })
          .json({
            code: 200,
            message: "토큰이 발급되었습니다.",
            accessToken,
          });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          code: 500,
          message: "서버 에러",
        });
      }
    }
  });
});

router.post("/logout", function (req, res) {
  console.log('쿠키도착!!', req.cookies);

  const { refreshToken } = req.cookies;

  Token.destroy({
    where: {
      RFS_TK: refreshToken
    }
  }).then(function () {
         return res
      .cookie('refreshToken', '', {maxAge: 0, 
      httpOnly: true,
            sameSite: "none",
            secure: true,}).json({
      code: 201,
      message: '토큰이 제거되었습니다.'
      });
  });
});

module.exports = router;
