const db = require("../db/models/index");
const { groupByDate } = require("../utils/utils");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);
const colorOptions = require("../constants");
const { Op } = require("sequelize");

const { User, Event, Calendar, UserCalendar } = db;

// User associated with calendar
async function getUserCalendar(req, res) {
  const { userId, calendarId } = req.params;
  try {
    const userCalendar = await Calendar.findByPk(calendarId, {
      include: {
        model: User,
        where: { id: userId },
      },
    });
    return res.json(userCalendar);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Get all events within calendar
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

// Get a list of events in calendar and group according to dates
async function getEventList(req, res) {
  const { id } = req.params;
  try {
    let calendar;
    if (req.query.title === undefined) {
      calendar = await Calendar.findByPk(id, {
        include: Event,
        order: [[Event, "start", "ASC"]],
      });
    } else {
      calendar = await Calendar.findByPk(id, {
        include: {
          model: Event,
          where: {
            title: { [Op.iLike]: `%${req.query.title}%` },
          },
          required: false,
        },
        order: [[Event, "start", "ASC"]],
      });
    }
    const groupedEvents = groupByDate(calendar.Events);
    return res.json(groupedEvents);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Add calendar
async function addCalendar(req, res) {
  const { name, imageUrl, userId } = req.body;
  try {
    const newCalendar = await Calendar.create({
      name: name,
      imageUrl: imageUrl,
    });

    const newUserCalendar = await UserCalendar.create({
      userId: userId,
      calendarId: newCalendar.id,
      roleId: 1,
      color: "#00B8D9",
    });

    return res.json(newCalendar);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Edit calendar details
async function editCalendar(req, res) {
  try {
    const calendarToAdd = req.body;
    const calendarToReplace = req.params.calendarId;
    let calendarToEdit = await Calendar.findByPk(calendarToReplace);
    await calendarToEdit.update(calendarToAdd);

    const allUserCalendar = await User.findByPk(req.params.userId, {
      include: Calendar,
      order: [[{ model: Calendar }, "id", "ASC"]],
    });

    return res.json(allUserCalendar);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Delete calendar
async function deleteCalendar(req, res) {
  const { calendarId, userId } = req.params;
  try {
    await Calendar.destroy({ where: { id: calendarId } });

    const allUserCalendar = await User.findByPk(userId, {
      include: Calendar,
      order: [[{ model: Calendar }, "id", "ASC"]],
    });

    return res.json(allUserCalendar);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// send invite to a particular calendar
async function sendInvite(req, res) {
  const { currUser, members, calendar, inviteUrl } = req.body;
  try {
    sendEmail(currUser, members, calendar, inviteUrl);
    return res.json({ msg: "Invited" });
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

/**
 * Function that uses sendgrid to send an email to users
 * @param {object} currUser
 * @param {object} members
 * @param {object} calendar
 * @param {string} inviteUrl
 */
const sendEmail = (currUser, members, calendar, inviteUrl) => {
  const msg = {
    to: members,
    from: currUser.email,
    subject: `Invitation to ${calendar.name}`,
    text: `You have been invited to ${calendar.name}. Click on this link to ${inviteUrl} to join.`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => console.log(error));
};

// get a single calendar
async function getInviteDetails(req, res) {
  try {
    const calendar = await Calendar.findByPk(req.params.id);
    return res.json(calendar);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// add user to usercalendar table
async function addToUserCalendar(req, res) {
  const { userEmail, calendarId } = req.body;
  try {
    const user = await User.findAll({
      where: {
        email: userEmail,
      },
    });
    const userId = user[0].dataValues.id;

    const randColorIndex = Math.floor(Math.random() * 10);

    const newUserCalendar = await UserCalendar.create({
      userId: userId,
      calendarId: calendarId,
      roleId: 2,
      color: colorOptions.colorOptions[randColorIndex].value,
    });

    // remove user from pending table
    await db.Pending.destroy({
      where: {
        email: userEmail,
        calendarId: calendarId,
      },
    });

    return res.json(newUserCalendar);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// leave calendar
async function leaveCalendar(req, res) {
  const { userId, calendarId } = req.params;
  try {
    await UserCalendar.destroy({
      where: {
        userId: userId,
        calendarId: calendarId,
        roleId: 2,
      },
    });

    const allUserCalendar = await User.findByPk(userId, {
      include: Calendar,
      order: [[{ model: Calendar }, "id", "ASC"]],
    });

    return res.json(allUserCalendar);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// get all users within calendar
async function getAllUsersInCalendar(req, res) {
  const { calendarId } = req.params;
  try {
    const users = await Calendar.findAll({
      where: {
        id: calendarId,
      },
      include: User,
    });

    return res.json(users);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  getUserCalendar,
  getCalendarEvents,
  getEventList,
  addCalendar,
  editCalendar,
  deleteCalendar,
  sendInvite,
  getInviteDetails,
  addToUserCalendar,
  leaveCalendar,
  getAllUsersInCalendar,
};
