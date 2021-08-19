"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
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
