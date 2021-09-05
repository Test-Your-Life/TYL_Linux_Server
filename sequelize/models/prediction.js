"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Prediction extends Model {
    static associate(models) {}
  }

  Prediction.init(
    {
      STK_CD: {
        type: DataTypes.STRING(10),
        primaryKey: true,
      },
      STK_NM: DataTypes.STRING,
      PRDT_TP: DataTypes.STRING,
      RATE: DataTypes.FLOAT,
      DT: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Prediction",
      tableName: "TB_PRDT",
      timestamps: false,
      charset: "utf8",
    }
  );

  return Prediction;
};
