const { Router } = require("express");
const { User } = require("../sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = Router();

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
      console.log("기존 가입 유저~");
      const { EMAIL, PRF_IMG, NK } = rows[0].dataValues;

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

        return res
          .cookie("refreshToken", refreshToken, { httpOnly: true })
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
