const { Router } = require("express");
const { Coin } = require("../sequelize");
const axios = require("axios");
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

router.get("/candle-data", async function (req, res) {
  const code = req.query.code;
  if (!code) return res.json({ code: 400, message: "쿼리가 누락되었습니다." });

  axios
    .get(`https://api.upbit.com/v1/candles/days?count=365&market=${code}`)
    .then((response) => {
      const datas = response.data;
      const candleData = datas.map((data) => {
        return {
          date: data.candle_date_time_kst,
          startValue: data.opening_price,
          endValue: data.trade_price,
          highValue: data.high_price,
          lowValue: data.low_price,
          rate: data.change_rate,
          tradeAmount: data.candle_acc_trade_volume,
        };
      });
      res.json({ code: 200, message: "전송완료", candleData: candleData });
    })
    .catch((err) => console.log('비트코인 에러'));
});

module.exports = router;
