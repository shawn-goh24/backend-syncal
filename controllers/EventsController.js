const db = require("../db/models/index");

const { Event, UserEvent, Calendar, User } = db;

// Get userevent table details
async function getEventWithUser(req, res) {
  const { eventId, userId } = req.params;
  try {
    const event = await UserEvent.findOne({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });

    return res.json(event);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// get event associated with user
async function getUsersInEvent(req, res) {
  const { eventId } = req.params;
  try {
    const usersInEvent = await Event.findByPk(eventId, {
      include: User,
    });
    return res.json(usersInEvent);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// get rsvp count from the event
async function getRsvpCount(req, res) {
  const { eventId } = req.params;
  try {
    const yes = await UserEvent.count({
      where: {
        eventId: eventId,
        rsvpId: 1,
      },
    });
    const no = await UserEvent.count({
      where: {
        eventId: eventId,
        rsvpId: 2,
      },
    });
    const maybe = await UserEvent.count({
      where: {
        eventId: eventId,
        rsvpId: 3,
      },
    });

    const rsvpCount = {
      Yes: yes,
      No: no,
      Maybe: maybe,
    };

    return res.json(rsvpCount);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Edit userevent table
async function editEventWithUser(req, res) {
  const { eventId, userId } = req.params;
  try {
    const rsvpId = req.body;
    let userEventToEdit = await UserEvent.findOne({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });

    if (userEventToEdit === null) {
      const newUserEvent = await UserEvent.create({
        userId: userId,
        eventId: eventId,
        roleId: 2,
        rsvpId: rsvpId.rsvpId,
      });
      return res.json(newUserEvent);
    } else {
      await userEventToEdit.update(rsvpId);
      return res.json(userEventToEdit);
    }
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Get add event - 1. add to Event table, 2. add to UserEvent table
async function addEvent(req, res) {
  const { newEventValues, calendarId, userId } = req.body;
  try {
    const newEvent = await Event.create({
      calendarId: calendarId,
      color: newEventValues.color,
      title: newEventValues.title,
      start: newEventValues.start,
      end: newEventValues.end,
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

// edit event
async function editEvent(req, res) {
  try {
    const eventToAdd = req.body.editedValues;
    const eventToReplace = req.params.eventId;
    let eventToEdit = await Event.findByPk(eventToReplace);
    await eventToEdit.update(eventToAdd);
    return res.json(eventToEdit);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// delete event
async function deleteEvent(req, res) {
  const { eventId, calendarId } = req.params;
  try {
    await Event.destroy({ where: { id: eventId } });

    const allEvents = await Calendar.findByPk(calendarId, {
      include: Event,
    });

    return res.json(allEvents);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  getEventWithUser,
  getUsersInEvent,
  addEvent,
  editEvent,
  deleteEvent,
  editEventWithUser,
  getRsvpCount,
};
