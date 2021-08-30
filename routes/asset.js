const { Router } = require("express");
const { User, Asset } = require("../sequelize");
const jwt = require("jsonwebtoken");
const { verifyToken, sendExpiredResponse } = require("./utils/jwt");

const router = Router();

router.get("/", async function (req, res) {
  const authorization = req.headers.authorization;
  if (!authorization)
    return res.json({ code: 401, message: "로그인이 필요한 서비스입니다." });
  const token = authorization.split("Bearer ")[1];
  try {
    const result = verifyToken(token);
    const email = result.email;
    const userQueryResult = await User.findOne({ where: { EMAIL: email } });
    const id = userQueryResult.dataValues.USER_ID;
    const assetQueryResult = await Asset.findAll({ where: { USER_ID: id } });

    let cash;
    let stock = { stockList: [], stockAsset: 0, stockProfit: 0 };
    let coin = { coinList: [], coinAsset: 0, coinProfit: 0 };
    const assetSum = assetQueryResult.reduce((acc, cur) => {
      const asset = cur.PRC * cur.CNT;
      const profit = asset - cur.TOT;
      if (cur.TRS_TP === "CASH") cash = { amount: cur.PRC };
      else if (cur.TRS_TP === "STOCK") {
        stock.stockList.push({
          name: cur.TRS_NM,
          price: cur.PRC,
          quantity: cur.CNT,
          profit: profit,
        });
        stock.stockProfit += profit;
        stock.stockAsset += asset;
      } else if (cur.TRS_TP === "COIN") {
        coin.coinList.push({
          name: cur.TRS_NM,
          price: cur.PRC,
          quantity: cur.CNT,
          profit: profit,
        });
        coin.coinProfit += profit;
        coin.coinAsset += asset;
      }
      return acc + cur.PRC * cur.CNT;
    }, 0);

    console.log(stock);
    res.json({
      asset: assetSum,
      cash: cash,
      stock: stock,
      coin: coin,
    });
  } catch (error) {
    console.error(error);
    sendExpiredResponse(res);
  }
});

module.exports = router;
