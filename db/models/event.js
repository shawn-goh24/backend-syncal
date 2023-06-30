const { DataTypes } = require("sequelize");

const initEvent = (sequelize) =>
  sequelize.define(
    "Event",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      calendarId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "calendars",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      allDay: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      start: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.TEXT,
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

module.exports = initEvent;
