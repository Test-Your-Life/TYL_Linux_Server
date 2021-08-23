"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    static associate(models) {}
  }

  Stock.init(
    {
      STK_ID: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      STK_CD: DataTypes.STRING(10),
      STK_NM: DataTypes.STRING,
      VL: DataTypes.INTEGER,
      STR_VL: DataTypes.INTEGER,
      END_VL: DataTypes.INTEGER,
      LOW_VL: DataTypes.INTEGER,
      HIGH_VL: DataTypes.INTEGER,
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
