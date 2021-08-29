"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Asset extends Model {
    static associate(models) {
      models.Asset.belongsTo(models.User, {});
    }
  }

  Asset.init(
    {
      ASS_ID: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      USER_ID: DataTypes.INTEGER,
      TRS_TP: DataTypes.STRING(10),
      TRS_NM: DataTypes.STRING(100),
      PRC: DataTypes.INTEGER,
      CNT: DataTypes.INTEGER,
      TOT: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Asset",
      tableName: "TB_ASS",
      timestamps: false,
      charset: "utf8",
    }
  );

  return Asset;
};
