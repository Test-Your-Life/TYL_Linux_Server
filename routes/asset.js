const { Router } = require("express");
const { User, Asset } = require("../sequelize");
const jwt = require("jsonwebtoken");
const { verifyToken, sendExpiredResponse } = require("./utils/jwt");

const router = Router();

router.get("/", async function (req, res) {
  const token = req.headers.authorization.split("Bearer ")[1];
  try {
    const result = verifyToken(token);
    const email = result.email;
    const userQueryResult = await User.findOne({ where: { EMAIL: email } });
    const id = userQueryResult.dataValues.USER_ID;
    const assetQueryResult = await Asset.findAll({ where: { USER_ID: id } });

    let cash;
    let stock = [];
    let coin = [];
    const assetSum = assetQueryResult.reduce((acc, cur) => {
      if (cur.TRS_TP === "CASH") cash = { amount: cur.PRC };
      else if (cur.TRS_TP === "STK")
        stock.push({ price: cur.PRC, quantity: cur.CNT, profit: cur.PRF });
      else if (cur.TRS_TP === "COIN")
        coin.push({ price: cur.PRC, quantity: cur.CNT, profit: cur.PRF });
      return acc + cur.PRC * cur.CNT;
    }, 0);

    res.json({ asset: assetSum, cash: cash, stock: stock, coin: coin });
  } catch (error) {
    console.error(error);
    sendExpiredResponse(res);
  }
  //   Token.destroy({
  //     where: {
  //       RFS_TK: refreshToken,
  //     },
  //   }).then(function () {
  //     return sendUnauthResponse(res);
  //   });
});

module.exports = router;
