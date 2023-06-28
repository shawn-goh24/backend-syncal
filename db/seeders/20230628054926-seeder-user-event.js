"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "user_events",
      [
        {
          user_id: 1,
          event_id: 1,
          role_id: 1,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          event_id: 2,
          role_id: 1,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          event_id: 3,
          role_id: 1,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          event_id: 4,
          role_id: 1,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          event_id: 5,
          role_id: 1,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          event_id: 6,
          role_id: 1,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 2,
          event_id: 6,
          role_id: 2,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          event_id: 7,
          role_id: 1,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 2,
          event_id: 7,
          role_id: 2,
          rsvp_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          event_id: 8,
          role_id: 2,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 2,
          event_id: 8,
          role_id: 1,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          event_id: 9,
          role_id: 1,
          rsvp_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 2,
          event_id: 9,
          role_id: 2,
          rsvp_id: 3,
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
    await queryInterface.bulkDelete("user_events", null, {});
  },
};
