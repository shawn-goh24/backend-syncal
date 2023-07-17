const db = require("../db/models/index");
const { google } = require("googleapis");
const axios = require("axios");
const {
  convertGoogleToDatabaseFormat,
  getGoogleEventsOnly,
} = require("../utils/utils");
const { zonedTimeToUtc, utcToZonedTime, format } = require("date-fns-tz");

const { User, Event, Calendar, UserCalendar } = db;

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

async function getRf(req, res) {
  try {
    console.log(req.body.code);
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

    console.log(response);

    return res.json(response.data);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

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
        // access_type: "offline",
        // scope: scopes,
      }
    );
    // console.log(managementApi.data);
    const token = managementApi.data.access_token;
    // console.log(token);

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
      console.log("Check if access_token valid");
      await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleAt}`
      );
    } catch (err) {
      const rft = await User.findByPk(req.params.userId);
      console.log(rft.dataValues.rft);

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

      console.log("response", data);
      console.log("response", response.data.access_token);

      googleAt = response.data.access_token;
    }
    // console.log(isAccessTokenExpired);

    // console.log(user.data);
    // console.log(user.data.identities[0].access_token);

    const calendarList = await fetchGoogleCalendarList(googleAt);

    return res.json(calendarList);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ error: true, msg: err });
  }
}

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
      console.log("Check if access_token valid");
      await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${googleAt}`
      );
    } catch (err) {
      const rft = await User.findByPk(req.params.userId);
      console.log(rft.dataValues.rft);

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

      console.log("response", data);
      console.log("response", response.data.access_token);

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

async function storeIntoDb(events) {
  try {
    // console.log("Flat Store into db: ", events.flat());
    let newlyCreatedEvent;
    events.flat().length > 0 &&
      (newlyCreatedEvent = await Event.bulkCreate(events.flat()));
    console.log(newlyCreatedEvent);
    return newlyCreatedEvent;
  } catch (err) {
    console.log(err);
  }
}

async function fetchGoogleCalendarList(accessToken) {
  const auth = new google.auth.OAuth2();

  auth.setCredentials({ access_token: accessToken });

  const calendar = google.calendar({ version: "v3", auth });
  const calendarList = await calendar.calendarList.list();

  return calendarList.data.items;
}

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

  // console.log("events: ", events.data.items);
  return newlyFormattedEvent;
}

module.exports = {
  oauthLogin,
  getRf,
  getGoogleCalendarList,
  getSelectedCalEvents,
};
