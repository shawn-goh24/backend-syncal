const { DataTypes } = require("sequelize");

const initUserEvent = (sequelize) =>
  sequelize.define(
    "UserEvent",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      eventId: {
        type: DataTypes.INTEGER,
        onDelete: "CASCADE",
        references: {
          model: "events",
          key: "id",
        },
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
      rsvpId: {
        type: DataTypes.INTEGER,
        references: {
          model: "rsvps",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
    }
  );

module.exports = initUserEvent;
