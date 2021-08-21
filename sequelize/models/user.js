"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      models.User.hasMany(models.AssetHistory, {
        foriegnKey: "USER_ID",
        sourceKey: "USER_ID",
      });
    }
  }

  User.init(
    {
      USER_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      EMAIL: DataTypes.STRING,
      PRF_IMG: DataTypes.STRING,
      NK: DataTypes.STRING(16),
      JN_DT: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "TB_USER",
      timestamps: false,
      charset: "utf8",
    }
  );

  return User;
};
