const moment = require("moment");
const { Router } = require("express");
const { Coin, Asset, TransactionHistory } = require("../sequelize");
const axios = require("axios");
const { verifyTokens } = require("./middlewares");
const db = require("./utils/db");

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
      const candleData = datas.reverse().map((data) => {
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
    .catch((err) => console.log("비트코인 에러"));
});

router.post("/transaction", verifyTokens, async function (req, res) {
  const email = req.decoded.email;
  const { trsType, code, name, assetType, value, amount } = req.body;
  if (!amount || !code || !value || !trsType || assetType !== "coin")
    return res.json({ code: 400, message: "필수 정보가 누락되었습니다." });

  console.log(req.body);
  const varies = trsType === "buy" ? 1 : -1;
  const coin = await Coin.findOne({ where: { COIN_CD: code } });
  const user = await db.getUserByEmail(email);

  const currentAsset = await Asset.findOne({
    where: { USER_ID: user.USER_ID, TRS_TP: "CASH" },
  });
  const cash = currentAsset.dataValues.PRC;

  if (trsType === "buy" && cash < value * amount)
    return res.json({ code: 400, message: "현금이 부족합니다." });

  const assetQueryRes = await Asset.findOne({
    where: { ASS_ID: `${user.USER_ID}_s${code}` },
  });

  if (!assetQueryRes) {
    Asset.create({
      ASS_ID: `${user.USER_ID}_s${code}`,
      USER_ID: user.USER_ID,
      TRS_TP: "COIN",
      TRS_NM: name,
      ASS_CD: code,
      PRC: value,
      CNT: amount,
      TOT: value * amount,
    });
  } else {
    const originAsset = assetQueryRes.dataValues;
    const totalAmt = varies * value * amount;
    const newAmt = originAsset.CNT + amount * varies;

    if (trsType === "sell" && originAsset.CNT < amount)
      return res.json({ code: 400, message: "보유 수량이 부족합니다." });

    Asset.update(
      {
        CNT: newAmt,
        TOT:
          trsType === "buy"
            ? originAsset.TOT + totalAmt
            : originAsset.TOT * ((originAsset.CNT - amount) / originAsset.CNT),
      },
      {
        where: {
          ASS_ID: `${user.USER_ID}_s${code}`,
        },
      }
    );
  }

  Asset.update(
    {
      PRC: cash + -1 * varies * value * amount,
    },
    {
      where: {
        USER_ID: user.USER_ID,
        TRS_TP: "CASH",
      },
    }
  );

  TransactionHistory.create({
    TRS_ID: `${moment(new Date()).tz("Asia/Seoul")}_${user.USER_ID}`,
    USER_ID: user.USER_ID,
    ASS_ID: `${user.USER_ID}_s${code}`,
    ASS_CD: code,
    ASS_NM: name,
    TRC_TP: trsType.toUpperCase(),
    TRS_AMT: amount,
    TRS_PR: value,
    TRS_DT: new Date(),
  });

  res.json({ code: 200, message: "거래가 성사되었습니다." });
});

module.exports = router;
