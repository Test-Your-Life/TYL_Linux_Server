"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TB_USER extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TB_USER.init(
    {
      USER_ID: DataTypes.BIGINT,
      EMAIL: DataTypes.STRING,
      PRF_IMG: DataTypes.STRING,
      NK: DataTypes.STRING,
      JN_DT: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "TB_USER",
      timestamps: false,
    }
  );
  return TB_USER;
};
