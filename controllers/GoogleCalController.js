const db = require("../db/models/index");
const { google } = require("googleapis");
const axios = require("axios");
const {
  convertGoogleToDatabaseFormat,
  getGoogleEventsOnly,
} = require("../utils/utils");
const { zonedTimeToUtc } = require("date-fns-tz");

const { User, Event } = db;

// handle get url from google
async function oauthLogin(req, res) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.CLIENT}/home`
    );
    const scopes = ["https://www.googleapis.com/auth/calendar"];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });

    return res.json(url);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// handle get user google details (RF/Access token)
async function getRf(req, res) {
  try {
    const response = await axios.post(
      `https://accounts.google.com/o/oauth2/token`,
      {
        grant_type: "authorization_code",
        code: req.body.code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${process.env.CLIENT}/home`,
      }
    );

    return res.json(response.data);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Retreive a list of calendar associated with the user
async function getGoogleCalendarList(req, res) {
  const { sub, id } = req.params;
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
    const token = managementApi.data.access_token;

    const user = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${sub}|${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let googleAt = user.data.identities[0].access_token;

    try {
      await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleAt}`
      );
    } catch (err) {
      const rft = await User.findByPk(req.params.userId);

      // get rft and get new accesstoken
      const refreshToken = rft.dataValues.rft;
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      const tokenUrl = "https://oauth2.googleapis.com/token";

      const data = {
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
      };

      const response = await axios.post(tokenUrl, null, {
        params: data,
      });

      googleAt = response.data.access_token;
    }

    const calendarList = await fetchGoogleCalendarList(googleAt);

    return res.json(calendarList);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: true, msg: err });
  }
}

// Retreive a list of events associated with the user and calendar
async function getSelectedCalEvents(req, res) {
  const { selectedCalendarIds, dbCalendarId, event } = req.body;
  const { sub, id } = req.params;

  try {
    const currentUtcDate = zonedTimeToUtc(new Date(), "Asia/Singapore");

    const managementApi = await axios.post(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        client_id: process.env.AUTH0_CLIENT_ID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
        audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
        grant_type: "client_credentials",
      }
    );
    const token = managementApi.data.access_token;

    const user = await axios.get(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${sub}|${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let googleAt = user.data.identities[0].access_token;

    try {
      await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleAt}`
      );
    } catch (err) {
      const rft = await User.findByPk(req.params.userId);

      // get rft and get new accesstoken
      const refreshToken = rft.dataValues.rft;
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      const tokenUrl = "https://oauth2.googleapis.com/token";

      const data = {
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
      };

      const response = await axios.post(tokenUrl, null, {
        params: data,
      });

      googleAt = response.data.access_token;
    }

    const events = [];
    const fetchPromises = selectedCalendarIds.map(async (item) => {
      const calendarEvent = await fetchGoogleEventList(
        googleAt,
        item,
        currentUtcDate,
        dbCalendarId
      );
      events.push(calendarEvent);
    });

    Promise.all(fetchPromises)
      .then(async () => {
        // check if duplicated in db
        const nonIntersectedEvents = getGoogleEventsOnly(event, events);
        const response = await storeIntoDb(nonIntersectedEvents);
        return res.json(response);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ error: true, msg: err });
      });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: true, msg: err });
  }
}

/**
 * Function that stores the google events into events db
 * @param {object} events
 * @returns {object}
 */
async function storeIntoDb(events) {
  try {
    let newlyCreatedEvent;
    events.flat().length > 0 &&
      (newlyCreatedEvent = await Event.bulkCreate(events.flat()));
    return newlyCreatedEvent;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Function that gets the list of calendar from google
 * @param {string} accessToken
 * @returns {object}
 */
async function fetchGoogleCalendarList(accessToken) {
  const auth = new google.auth.OAuth2();

  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  const calendarList = await calendar.calendarList.list();

  return calendarList.data.items;
}

/**
 * Function that gets all events from starting date from selected google cal
 * @param {string} accessToken
 * @param {int} calendarId
 * @param {date} currentUtcDate
 * @param {int} dbCalendarId
 * @returns {object}
 */
async function fetchGoogleEventList(
  accessToken,
  calendarId,
  currentUtcDate,
  dbCalendarId
) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  const events = await calendar.events.list({
    calendarId: calendarId,
    timeMin: currentUtcDate,
  });

  // conver to db format
  const newlyFormattedEvent = convertGoogleToDatabaseFormat(
    events.data.items,
    dbCalendarId
  );

  return newlyFormattedEvent;
}

module.exports = {
  oauthLogin,
  getRf,
  getGoogleCalendarList,
  getSelectedCalEvents,
};
