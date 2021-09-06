const { Router } = require("express");
const { verifyTokens } = require("./middlewares");
const db = require("./utils/db");

const router = Router();

router.post("/change/nickname", verifyTokens, async function (req, res) {
  const email = req.decoded.email;
  const { nickname } = req.body;

  if (!nickname)
    return res.json({ code: 400, message: "닉네임이 누락되었습니다." });

  const user = await db.getUserByEmail(email);
  const validity = await db.checkNicknameValidity(nickname);

  if (validity)
    return res.json({ code: 400, message: "중복되는 닉네임이 존재합니다." });

  db.updateNickname(user, nickname);

  res.json({ code: 200, message: "OK" });
});

module.exports = router;
