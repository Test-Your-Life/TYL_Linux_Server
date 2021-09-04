const { Router } = require("express");
const { verifyTokens } = require("./middlewares");
const { getTotalAssetData } = require("./utils/assetHelper");
const db = require("./utils/db");

const router = Router();

router.get("/transaction", verifyTokens, async function (req, res) {
  const { code, type } = req.query;
  if (!code || !type)
    return res.json({ code: 400, message: "쿼리가 누락되었습니다." });

  const email = req.decoded.email;
  const user = await db.getUserByEmail(email);
  const trsHistories = await db.selectTransactionHistory(user, code);

  const data = trsHistories.map((e) => {
    return {
      type: e.TRC_TP,
      code: e.ASS_CD,
      name: e.ASS_NM,
      amount: e.TRS_AMT,
      price: e.TRS_PR,
      date: e.TRS_DT,
    };
  });

  res.json({ code: 200, message: "OK", history: data });
});

router.get("/history", verifyTokens, async function (req, res) {
  const email = req.decoded.email;
  const user = await db.getUserByEmail(email);
  const history = await db.selectAssetHistory(user);
  const data = !history
    ? {}
    : history.map((e) => {
        return { asset: e.ASS_SUM, date: e.DT };
      });

  res.send({ code: 200, message: "전송완료", history: data });
});

router.get("/", verifyTokens, async function (req, res) {
  const email = req.decoded.email;
  const user = await db.getUserByEmail(email);
  const assets = await db.selectAsset(user);
  const data = getTotalAssetData(assets);
  res.json(data);
});

module.exports = router;
