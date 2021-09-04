const {
  User,
  Asset,
  AssetHistory,
  TransactionHistory,
  StockHistData,
} = require("../../sequelize");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  createNewUser: async (email, nickname) => {
    const user = await User.create({
      EMAIL: email,
      NK: nickname,
      JN_DT: new Date(),
    });
    await Asset.create({
      ASS_ID: `${user.USER_ID}_cash`,
      USER_ID: user.USER_ID,
      TRS_TP: "CASH",
      TRS_NM: "현금",
      PRC: 1000000,
      CNT: 1,
    });
    return user;
  },
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
  selectAsset: async (user) => {
    return await Asset.findAll({
      where: { USER_ID: user.USER_ID },
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
  selectTransactionHistory: async (user, code) => {
    return await TransactionHistory.findAll({
      where: { USER_ID: user.USER_ID, ASS_CD: code },
    });
  },
};
