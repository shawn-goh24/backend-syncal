"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("events", "end");
    await queryInterface.addColumn("events", "end", {
      type: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("events", "end", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.removeColumn("events", "end");
  },
};
