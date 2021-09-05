"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Coin extends Model {
    static associate(models) {}
  }

  Coin.init(
    {
      COIN_CD: {
        type: DataTypes.STRING(10),
        primaryKey: true,
      },
      COIN_NM: DataTypes.STRING,
      VL: DataTypes.DOUBLE,
      STR_VL: DataTypes.DOUBLE,
      END_VL: DataTypes.DOUBLE,
      LOW_VL: DataTypes.DOUBLE,
      HIGH_VL: DataTypes.DOUBLE,
      AMT: DataTypes.DOUBLE,
      RATE: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "Coin",
      tableName: "TB_COIN",
      timestamps: false,
      charset: "utf8",
    }
  );

  return Coin;
};
