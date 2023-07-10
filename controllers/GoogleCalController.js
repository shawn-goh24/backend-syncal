const db = require("../db/models/index");
const { google } = require("googleapis");
const axios = require("axios");

const { User, Event, Calendar, UserCalendar } = db;

async function getGoogleCalendarList(req, res) {
  const { sub, id } = req.params;
  // const userId = auth0UserId.replace("%7C", "|");
  console.log(sub, id);
  try {
    const managementApi = await axios.post(
      `https://dev-e27oql725amd8bwx.us.auth0.com/oauth/token`,
      {
        client_id: "R91sYprWrLnH8ZVQbYtV8AAhyUmgymRR",
        client_secret:
          "IUAbul5dCEA9VtwyqafTeZj0XqfSNxDOHAyozwktLKe8V-6-xSMrl-Yy48SFFeA_",
        audience: "https://dev-e27oql725amd8bwx.us.auth0.com/api/v2/",
        grant_type: "client_credentials",
      }
    );
    const token = managementApi.data.access_token;

    const user = await axios.get(
      `https://dev-e27oql725amd8bwx.us.auth0.com/api/v2/users/${sub}|${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const calendarList = await fetchGoogleCalendarList(
      user.data.identities[0].access_token
    );

    return res.json(calendarList);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: true, msg: err });
  }
}

async function fetchGoogleCalendarList(accessToken) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  const calendarList = await calendar.calendarList.list();

  return calendarList.data.items;
}

module.exports = {
  getGoogleCalendarList,
};
