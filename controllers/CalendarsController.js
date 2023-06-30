const db = require("../db/models/index");

const { User, Event, Calendar } = db;

// Get all user (Test Route)
async function getCalendarEvents(req, res) {
  const { id } = req.params;
  try {
    const calendarEvent = await Calendar.findByPk(id, {
      include: Event,
    });
    return res.json(calendarEvent);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  getCalendarEvents,
};
