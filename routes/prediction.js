const { Router } = require("express");
const { Prediction } = require("../sequelize");
const router = Router();

router.get("/", async function (req, res) {
  const predictions = await Prediction.findAll();
  const rf = predictions
    .filter((e) => e.PRDT_TP === "RF")
    .map((e) => {
      return { code: e.STK_CD, name: e.STK_NM, rate: e.RATE };
    });
  const xgb = predictions
    .filter((e) => e.PRDT_TP === "XGB")
    .map((e) => {
      return { code: e.STK_CD, name: e.STK_NM, rate: e.RATE };
    });

  console.log(rf, xgb);

  res.json({ code: 200, message: "OK", prediction: { rf: rf, xgb: xgb } });
});

module.exports = router;
