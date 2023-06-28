"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "rsvps",
      [
        {
          name: "Yes",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "No",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Maybe",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {
        underscored: true,
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("rsvps", null, {});
  },
};
