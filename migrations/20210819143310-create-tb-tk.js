"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("TB_TK", {
      RFS_TK: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      USER_ID: {
        type: Sequelize.INTEGER,
      },
      CR_DT: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("TB_TK");
  },
};
