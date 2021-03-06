const moment = require("moment");
const { Router } = require("express");
const {
  User,
  Stock,
  StockCode,
  TransactionHistory,
  Asset,
} = require("../sequelize");
const { verifyToken, sendExpiredResponse } = require("./utils/jwt");
const { verifyTokens } = require("./middlewares");
const db = require("./utils/db");

const router = Router();

router.get("/real-data", async function (req, res) {
  const stocks = await Stock.findAll({ order: [["AMT", "DESC"]] });
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

router.get("/candle-data", async function (req, res) {
  const code = req.query.code;
  if (!code) return res.json({ code: 400, message: "쿼리가 누락되었습니다." });
  const histories = await db.selectStockHistoryByCode(code);
  const candleData = histories.map((e) => {
    return {
      date: e.DT,
      startValue: e.STR_VL,
      endValue: e.END_VL,
      highValue: e.HIGH_VL,
      lowValue: e.LOW_VL,
      rate: e.RATE,
      tradeAmount: e.AMT,
    };
  });
  res.json({ code: 200, message: "전송완료", candleData: candleData });
});

router.get("/amount", verifyTokens, async function (req, res) {
  const code = req.query.code;
  if (!code) return res.json({ code: 400, message: "쿼리가 누락되었습니다." });

  const email = req.decoded.email;
  const user = await db.getUserByEmail(email);
  const stockAmount = await db.getStockAmount(code, user.USER_ID);

  res.json({ code: 200, message: "전송완료", amount: stockAmount });
});

router.post("/transaction", verifyTokens, async function (req, res) {
  const email = req.decoded.email;
  const { trsType, code, name, assetType, value, amount } = req.body;
  if (!amount || !code || !value || !trsType)
    return res.json({ code: 400, message: "필수 정보가 누락되었습니다." });
  if (amount < 0 || assetType !== "stock")
    return res.json({ code: 400, message: "1 이상의 양이 필요합니다." });
  console.log(req.body);
  const varies = trsType === "buy" ? 1 : -1;
  const stock = await Stock.findOne({ where: { STK_CD: code } });

  if (stock.dataValues.VL !== value)
    return res.json({ code: 400, message: "현재 가격과 일치하지 않습니다." });

  const userQueryRes = await User.findOne({ where: { EMAIL: email } });
  const user = userQueryRes.dataValues;

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
      TRS_TP: "STOCK",
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
