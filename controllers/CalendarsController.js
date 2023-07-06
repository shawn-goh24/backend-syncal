const db = require("../db/models/index");
const { groupByDate } = require("../utils/utils");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);

const { User, Event, Calendar, UserCalendar } = db;

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

async function sendInvite(req, res) {
  const { currUser, members, calendar, inviteUrl } = req.body;
  try {
    sendEmail(currUser, members, calendar, inviteUrl);
    return res.json({ msg: "Invited" });
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

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

async function getInviteDetails(req, res) {
  try {
    console.log(req.params.id);
    const calendar = await Calendar.findByPk(req.params.id);
    return res.json(calendar);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  getCalendarEvents,
  getEventList,
  addCalendar,
  editCalendar,
  deleteCalendar,
  sendInvite,
  getInviteDetails,
};
