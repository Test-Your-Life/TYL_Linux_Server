const { Router } = require("express");
const { User, AssetHistory } = require("../sequelize");
const { Op } = require("sequelize");
const moment = require("moment");

const router = Router();

router.get("/preday-history", async function (req, res) {
  const users = await User.findAll();
  let history = [];
  for (const user of users) {
    const userId = user.dataValues.USER_ID;
    const assetHistory = await AssetHistory.findOne({
      where: {
        USER_ID: userId,
        DT: {
          [Op.gte]: moment().subtract(2, "days").toDate(),
        },
      },
    });
    if (!assetHistory) continue;
    const { PRF, ASS_SUM } = assetHistory.dataValues;
    history.push({
      nickname: user.NK,
      profit: ((PRF / ASS_SUM) * 100).toFixed(2),
    });
  }

  history.sort((a, b) => (a.profit < b.profit ? 1 : -1));
  const upperRank = history.splice(0, 8);
  const lowerRank = history.splice(history.length - 8);
  res.json({ upperRank: upperRank, lowerRank: lowerRank });
});

router.get("/asset", async function (req, res) {
  const users = await User.findAll();
  let history = [];
  for (const user of users) {
    const userId = user.dataValues.USER_ID;
    const assetHistory = await AssetHistory.findOne({
      where: {
        USER_ID: userId,
        DT: {
          [Op.gte]: moment().subtract(2, "days").toDate(),
        },
      },
    });
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
