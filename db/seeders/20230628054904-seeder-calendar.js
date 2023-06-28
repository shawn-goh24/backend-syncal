"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "calendars",
      [
        {
          name: "Shawn's Personal",
          image_url: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Eggplant",
          image_url:
            "https://images.unsplash.com/photo-1604245437608-50c6bb8d4ee5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Fruity's Personal",
          image_url: "",
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
    await queryInterface.bulkDelete("calendars", null, {});
  },
};
