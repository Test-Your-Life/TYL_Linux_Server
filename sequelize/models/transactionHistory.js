"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TransactionHistory extends Model {
    static associate(models) {}
  }

  TransactionHistory.init(
    {
      TRS_ID: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      USER_ID: DataTypes.INTEGER,
      ASS_ID: DataTypes.STRING,
      ASS_CD: DataTypes.STRING,
      ASS_NM: DataTypes.STRING,
      TRC_TP: DataTypes.STRING(10),
      TRS_AMT: DataTypes.INTEGER,
      TRS_PR: DataTypes.INTEGER,
      TRS_DT: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "TransactionHistory",
      tableName: "TB_TRS_HST",
      timestamps: false,
      charset: "utf8",
    }
  );

  return TransactionHistory;
};
