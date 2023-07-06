"use strict";

const Sequelize = require("sequelize");
const process = require("process");
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../../config/database.js")[env];
const initUser = require("./user.js");
const initCalendar = require("./calendar.js");
const initRole = require("./role.js");
const initEvent = require("./event.js");
const initUserCalendar = require("./user_calendar.js");
const initRsvp = require("./rsvp.js");
const initUserEvent = require("./user_event.js");
const initPending = require("./pending.js");
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

// Initialise models
db.User = initUser(sequelize);
db.Calendar = initCalendar(sequelize);
db.Role = initRole(sequelize);
db.Event = initEvent(sequelize);
db.UserCalendar = initUserCalendar(sequelize);
db.Rsvp = initRsvp(sequelize);
db.UserEvent = initUserEvent(sequelize);
db.Pending = initPending(sequelize);

// Calendar - Events (1-M)
db.Calendar.hasMany(db.Event, {
  foreignKey: "calendarId",
});
db.Event.belongsTo(db.Calendar);

// UserEvents (M-M)
db.User.belongsToMany(db.Event, { through: db.UserEvent });
db.Event.belongsToMany(db.User, { through: db.UserEvent });
db.UserEvent.belongsTo(db.User);
db.UserEvent.belongsTo(db.Event);
db.UserEvent.belongsTo(db.Rsvp);
db.UserEvent.belongsTo(db.Role);

// UsersCalendar (M-M)
db.User.belongsToMany(db.Calendar, { through: db.UserCalendar });
db.Calendar.belongsToMany(db.User, { through: db.UserCalendar });
db.UserCalendar.belongsTo(db.User);
db.UserCalendar.belongsTo(db.Calendar);
db.UserCalendar.belongsTo(db.Role);

// Pending - Calendars
db.Calendar.hasMany(db.Pending, {
  foreignKey: "calendarId",
});
db.Pending.belongsTo(db.Calendar);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
