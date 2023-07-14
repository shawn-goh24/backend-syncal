const db = require("../db/models/index");
const { google } = require("googleapis");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const { User, Calendar, UserCalendar } = db;

// Check & get single user
async function getUser(req, res) {
  const currUser = req.body.user;
  try {
    const [user, created] = await User.findOrCreate({
      where: { email: currUser.email },
      defaults: {
        name: currUser.name,
        avatarUrl: currUser.picture,
      },
    });

    if (created) {
      const newCalendar = await Calendar.create({
        name: `${currUser.name}'s Personal`,
      });
      await UserCalendar.create({
        userId: user.id,
        calendarId: newCalendar.id,
        roleId: 1,
        color: "#00B8D9",
      });
    }

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Get calendar associated with user
async function getGroup(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      include: Calendar,
      order: [[{ model: Calendar }, "id", "ASC"]],
    });
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Get calendar associated with user
async function editUser(req, res) {
  const { userId } = req.params;
  try {
    const name = req.body;
    const userToReplace = userId;
    let userToEdit = await User.findByPk(userToReplace);
    await userToEdit.update(name);
    return res.json(userToEdit);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Get all user (Test Route)
async function testRoute(req, res) {
  try {
    const managementApi = await axios.post(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
        grant_type: "client_credentials",
      }
    );
    const accessToken = managementApi.data.access_token;

    const user = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const eventList = await fetchGoogleCalendarEvents(
      user.data.identities[0].access_token
    );

    const users = await User.findAll();
    return res.json(eventList);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: true, msg: err });
  }
}

async function fetchGoogleCalendarEvents(accessToken) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  const events = await calendar.events.list({ calendarId: "primary" });
  const calendarList = await calendar.calendarList.list();
  // console.log(events.data.items);

  return calendarList.data.items;
}

module.exports = {
  testRoute,
  getUser,
  getGroup,
  editUser,
};
