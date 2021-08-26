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
      VL: DataTypes.INTEGER,
      STR_VL: DataTypes.INTEGER,
      END_VL: DataTypes.INTEGER,
      LOW_VL: DataTypes.INTEGER,
      HIGH_VL: DataTypes.INTEGER,
      AMT: DataTypes.BIGINT,
      RATE: DataTypes.FLOAT,
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
