"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("events", "calendar_id");
    await queryInterface.addColumn("events", "calendar_id", {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "calendars",
        key: "id",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("events", "calendar_id");
    await queryInterface.addColumn("events", "calendar_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "calendars",
        key: "id",
      },
    });
  },
};
