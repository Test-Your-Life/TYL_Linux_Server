const { Router } = require("express");
const { User, Asset, TransactionHistory } = require("../sequelize");
const jwt = require("jsonwebtoken");
const { sendExpiredResponse, verifyToken } = require("./utils/jwt");
const { verifyAuthorization } = require("./utils/authHelper");

const router = Router();

router.get("/history", async function (req, res) {
  const { code, type } = req.query;

  const result = verifyAuthorization(req.headers.authorization);
  if (result.code === 401) return res.json(result);
  const email = result;
  const userQueryResult = await User.findOne({ where: { EMAIL: email } });
  const id = userQueryResult.dataValues.USER_ID;
  const assetHistsResult = await TransactionHistory.findAll({
    where: { USER_ID: id, ASS_CD: code },
  });

  const data = assetHistsResult.map((e) => {
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

router.get("/", async function (req, res) {
  const result = verifyAuthorization(req.headers.authorization);

  if (result.code === 401) return res.json(result);

  const email = result;
  const userQueryResult = await User.findOne({ where: { EMAIL: email } });
  const id = userQueryResult.dataValues.USER_ID;
  const assetQueryResult = await Asset.findAll({ where: { USER_ID: id } });

  let cash;
  let stock = { stockList: [], stockAsset: 0, stockProfit: 0 };
  let coin = { coinList: [], coinAsset: 0, coinProfit: 0 };

  const assetSum = assetQueryResult.reduce((acc, cur) => {
    const asset = cur.PRC * cur.CNT;
    const profit = asset - cur.TOT;

    if (cur.CNT > 0) {
      if (cur.TRS_TP === "CASH") cash = { amount: cur.PRC };
      else if (cur.TRS_TP === "STOCK") {
        stock.stockList.push({
          code: cur.ASS_CD,
          name: cur.TRS_NM,
          price: cur.PRC,
          quantity: cur.CNT,
          profit: profit,
        });
        stock.stockProfit += profit;
        stock.stockAsset += asset;
      } else if (cur.TRS_TP === "COIN") {
        coin.coinList.push({
          code: cur.ASS_CD,
          name: cur.TRS_NM,
          price: cur.PRC,
          quantity: cur.CNT,
          profit: profit,
        });
        coin.coinProfit += profit;
        coin.coinAsset += asset;
      }
    }
    return acc + cur.PRC * cur.CNT;
  }, 0);

  res.json({
    asset: assetSum,
    cash: cash,
    stock: stock,
    coin: coin,
  });
});

module.exports = router;
