"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {}
  }

  Stock.init(
    {
      STK_CD: {
        type: DataTypes.STRING(10),
        primaryKey: true,
      },
      STK_NM: DataTypes.STRING,
      VL: DataTypes.INTEGER,
      STR_VL: DataTypes.INTEGER,
      END_VL: DataTypes.INTEGER,
      LOW_VL: DataTypes.INTEGER,
      HIGH_VL: DataTypes.INTEGER,
      AMT: DataTypes.BIGINT,
      RATE: DataTypes.FLOAT,
      IMG_PATH: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Stock",
      tableName: "TB_STK",
      timestamps: false,
      charset: "utf8",
    }
  );

  return Stock;
};
