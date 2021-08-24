const { Router } = require("express");
const { Stock, StockCode } = require("../sequelize");

const router = Router();

router.get("/real-data", async function (req, res) {
  const stocks = await Stock.findAll();
  const stockList = stocks.map((stock) => {
    const { AMT, STR_VL, END_VL, HIGH_VL, LOW_VL, RATE, STK_NM, STK_CD } =
      stock.dataValues;
    return {
      code: STK_CD,
      name: STK_NM,
      value: END_VL,
      startValue: STR_VL,
      endValue: END_VL,
      highValue: HIGH_VL,
      lowValue: LOW_VL,
      rate: RATE,
      tradeAmount: AMT,
    };
  });
  res.json(stockList);
});

module.exports = router;
