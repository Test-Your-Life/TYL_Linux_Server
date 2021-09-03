const { User, AssetHistory } = require("../../sequelize");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  getUserByEmail: async (email) => {
    return await User.findOne({ where: { EMAIL: email } });
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
};
