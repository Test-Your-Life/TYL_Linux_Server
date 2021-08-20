const { Router } = require("express");
const { User, Token } = require("../sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = Router();

router.post("/slient-refresh", function (req, res) {
  console.log(req.cookies);
  console.log(req.headers);
  res.json({ code: 200 });
  //   res
  //     .cookie("refreshToken", 123, {
  //       httpOnly: true,
  //     })
  //     .json({
  //       code: 200,
  //       message: "토큰이 발급되었습니다.",
  //     });
});

router.post("/", function (req, res) {
  let json = {};
  const { email, name } = req.body;
  console.log(req.headers);

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

      json = {
        hasSignedUp: false,
        user: {},
      };
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
            expires: new Date(new Date() + 900000),
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

module.exports = router;
