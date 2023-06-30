const db = require("../db/models/index");
const { groupByDate } = require("../utils/utils");

const { User, Event, Calendar } = db;

// Get all user (Test Route)
async function getCalendarEvents(req, res) {
  const { id } = req.params;
  try {
    const calendarEvents = await Calendar.findByPk(id, {
      include: Event,
    });
    return res.json(calendarEvents);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Get all events arrange and group according to dates & time
async function getEventList(req, res) {
  const { id } = req.params;
  try {
    const calendar = await Calendar.findByPk(id, {
      include: Event,
      order: [[Event, "start", "ASC"]],
    });
    console.log("groupedEvents");
    const groupedEvents = groupByDate(calendar.Events);
    return res.json(groupedEvents);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  getCalendarEvents,
  getEventList,
};
