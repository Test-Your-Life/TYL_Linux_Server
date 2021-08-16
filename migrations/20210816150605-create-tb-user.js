"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("TB_USER", {
      USER_ID: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      EMAIL: {
        type: Sequelize.STRING,
      },
      PRF_IMG: {
        type: Sequelize.STRING,
      },
      NK: {
        type: Sequelize.STRING,
      },
      JN_DT: {
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("TB_USER");
  },
};
