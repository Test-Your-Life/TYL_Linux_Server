const { Router } = require("express");
const { Coin } = require("../sequelize");
const router = Router();

router.get("/real-data", async function (req, res) {
  const coins = await Coin.findAll({ order: [["AMT", "DESC"]] });
  const coinList = coins.map((coin) => {
    const { AMT, STR_VL, END_VL, HIGH_VL, LOW_VL, RATE, COIN_NM, COIN_CD } =
      coin.dataValues;
    return {
      code: COIN_CD,
      name: COIN_NM,
      value: END_VL,
      startValue: STR_VL,
      endValue: END_VL,
      highValue: HIGH_VL,
      lowValue: LOW_VL,
      rate: RATE,
      tradeAmount: AMT,
    };
  });
  res.json(coinList);
});

module.exports = router;
