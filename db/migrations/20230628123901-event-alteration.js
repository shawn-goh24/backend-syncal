"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("events", "name");
    await queryInterface.addColumn("events", "title", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.removeColumn("events", "is_all_day");
    await queryInterface.addColumn("events", "all_day", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });

    await queryInterface.removeColumn("events", "start_datetime");
    await queryInterface.addColumn("events", "start", {
      type: Sequelize.DATE,
      allowNull: false,
    });

    await queryInterface.removeColumn("events", "end_datetime");
    await queryInterface.addColumn("events", "end", {
      type: Sequelize.DATE,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("events", "name", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.removeColumn("events", "title");

    await queryInterface.addColumn("events", "is_all_day", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
    await queryInterface.removeColumn("events", "all_day");

    await queryInterface.addColumn("events", "start_datetime", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.removeColumn("events", "start");

    await queryInterface.addColumn("events", "end_datetime", {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.removeColumn("events", "end");
  },
};
