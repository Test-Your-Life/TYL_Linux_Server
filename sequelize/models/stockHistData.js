"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StockHistData extends Model {
    static associate(models) {}
  }

  StockHistData.init(
    {
      HDT_ID: {
        type: DataTypes.STRING(32),
        primaryKey: true,
      },
      STK_CD: DataTypes.STRING(32),
      DT: DataTypes.DATE,
      STR_VL: DataTypes.INTEGER,
      END_VL: DataTypes.INTEGER,
      LOW_VL: DataTypes.INTEGER,
      HIGH_VL: DataTypes.INTEGER,
      AMT: DataTypes.BIGINT,
      RATE: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "StockHistData",
      tableName: "TB_STK_HDT",
      timestamps: false,
      charset: "utf8",
    }
  );

  return StockHistData;
};
