const { User, Asset, AssetHistory } = require("../sequelize");
const moment = require("moment");

exports.updateAssetHistory = async () => {
  const users = await User.findAll();
  const seoul = moment(new Date()).tz("Asia/Seoul");
  const date = seoul.format("YYYY-MM-DD");
  const tommorow = seoul.subtract(1, "days").format("YYYY-MM-DD");

  users.forEach(async (user) => {
    const assets = await Asset.findAll({ where: { USER_ID: user.USER_ID } });
    const beforeAsset = await AssetHistory.findOne({
      where: { USER_ID: user.USER_ID, DT: new Date(tommorow) },
    });

    const sum = assets.reduce((acc, cur) => acc + cur.PRC * cur.CNT, 0);
    const profit = beforeAsset ? sum - beforeAsset.ASS_SUM : 0;

    console.log("crond >", user.NK, profit);

    AssetHistory.create({
      ASS_HST_ID: `${date.replace(/-/gi, "")}-${user.USER_ID}`,
      USER_ID: user.USER_ID,
      ASS_SUM: sum,
      PRF: profit,
      DT: date,
    });
  });
};
