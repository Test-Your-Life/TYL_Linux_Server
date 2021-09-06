const { Router } = require("express");
const db = require("./utils/db");

const router = Router();

router.get("/preday-history", async function (req, res) {
  const users = await db.selectUser();

  let history = [];
  for (const user of users) {
    const assetHistory = await db.getBeforeDayAsset(user);
    if (!assetHistory) continue;
    // console.log(assetHistory.DT, user.NK);
    const { PRF, ASS_SUM } = assetHistory.dataValues;
    history.push({
      nickname: user.NK,
      profit: ((PRF / ASS_SUM) * 100).toFixed(2),
    });
  }
  history.sort((a, b) => (a.profit < b.profit ? 1 : -1));

  const upperRank = history.slice(0, 8);
  const lowerRank = history.slice(history.length - 8);

  res.json({ upperRank: upperRank, lowerRank: lowerRank });
});

router.get("/asset", async function (req, res) {
  const users = await db.selectUser();

  let history = [];
  for (const user of users) {
    const userId = user.dataValues.USER_ID;
    const assetHistory = await db.getBeforeDayAsset(user);
    if (!assetHistory) continue;
    const { PRF, ASS_SUM } = assetHistory.dataValues;
    history.push({
      nickname: user.NK,
      asset: ASS_SUM,
    });
  }

  history.sort((a, b) => (a.asset < b.asset ? 1 : -1));
  res.json({ rank: history });
});

module.exports = router;
