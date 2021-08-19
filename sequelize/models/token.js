"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {}
  }

  Token.init(
    {
      RFS_TK: { type: DataTypes.STRING(256), primaryKey: true },
      USER_ID: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Token",
      tableName: "TB_TK",
      timestamps: false,
      charset: "utf8",
    }
  );

  return Token;
};
