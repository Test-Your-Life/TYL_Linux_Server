"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssetHistory extends Model {
    static associate(models) {
      models.AssetHistory.belongsTo(models.User, {});
    }
  }

  AssetHistory.init(
    {
      ASS_HST_ID: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      USER_ID: DataTypes.INTEGER,
      ASS_SUM: DataTypes.INTEGER,
      PRF: DataTypes.INTEGER,
      DT: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "AssetHistory",
      tableName: "TB_ASS_HST",
      timestamps: false,
      charset: "utf8",
    }
  );

  return AssetHistory;
};
