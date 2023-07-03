const db = require("../db/models/index");

const { Event, UserEvent } = db;

// Get add event - 1. add to Event table, 2. add to UserEvent table
async function addEvent(req, res) {
  const { newEventValues, calendarId, userId } = req.body;
  try {
    const start = newEventValues.allDay
      ? newEventValues.startDate
      : newEventValues.startDateTime;
    const end = newEventValues.allDay
      ? newEventValues.endDate
      : newEventValues.endDateTime;

    const newEvent = await Event.create({
      calendarId: calendarId,
      color: newEventValues.color,
      title: newEventValues.title,
      start: start,
      end: end,
      description: newEventValues.description,
      location: newEventValues.location,
      allDay: newEventValues.allDay,
    });

    const newUserEvent = await UserEvent.create({
      userId: userId,
      eventId: newEvent.id,
      roleId: 1,
      rsvpId: 1,
    });

    return res.json(newEvent);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

async function editEvent(req, res) {
  try {
    const eventToAdd = req.body;
    const eventToReplace = req.params.eventId;
    let eventToEdit = await Event.findByPk(eventToReplace);
    await eventToEdit.update(eventToAdd);
    return res.json(eventToEdit);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  addEvent,
  editEvent,
};
