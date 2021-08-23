"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class StockCode extends Model {
    static associate(models) {}
  }

  StockCode.init(
    {
      STK_CD: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      STK_NM: DataTypes.STRING,
      MRKT: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "StockCode",
      tableName: "TB_STK_CD",
      timestamps: false,
      charset: "utf8",
    }
  );

  return StockCode;
};
