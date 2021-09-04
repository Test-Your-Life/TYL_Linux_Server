const { User, Asset, AssetHistory, StockHistData } = require("../../sequelize");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  getUserByEmail: async (email) => {
    return await User.findOne({ where: { EMAIL: email } });
  },
  selectUser: async () => {
    return await User.findAll();
  },
  selectAssetHistory: async (user) => {
    return await AssetHistory.findAll({
      where: {
        USER_ID: user.USER_ID,
        DT: {
          [Op.gte]: moment().subtract(6, "months").toDate(),
        },
      },
    });
  },
  getBeforeDayAsset: async (user) => {
    return await AssetHistory.findOne({
      where: {
        USER_ID: user.USER_ID,
        DT: {
          [Op.gte]: moment().subtract(24, "hours").toDate(),
        },
      },
    });
  },
  selectStockHistoryByCode: async (code) => {
    return await StockHistData.findAll({
      where: {
        STK_CD: code,
      },
      order: [["DT", "ASC"]],
    });
  },
  getStockAmount: async (code, id) => {
    const stock = await Asset.findOne({
      where: { ASS_CD: code, USER_ID: id },
    });
    return stock ? stock.CNT : 0;
  },
};
