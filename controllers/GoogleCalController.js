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
      "763107087367-ki8cr68hvgmg9kho6d7ph6qlvpafrefj.apps.googleusercontent.com",
      "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",
      "http://localhost:3000/home"
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
    // console.log(req.body.code);
    const res = await axios.post(`https://accounts.google.com/o/oauth2/token`, {
      grant_type: "authorization_code",
      code: req.body.code,
      client_id:
        "763107087367-ki8cr68hvgmg9kho6d7ph6qlvpafrefj.apps.googleusercontent.com",
      client_secret: "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",
      redirect_uri: "http://localhost:3000/home",
    });

    // console.log(res.data);

    return res.json(res.data);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

async function getGoogleCalendarList(req, res) {
  const { sub, id } = req.params;
  // const userId = auth0UserId.replace("%7C", "|");
  // console.log(sub, id);
  try {
    // http://localhost:3000/home?code=4%2F0AZEOvhVfmDp4Bewm1VA6YZCefZZbugrjBO_qTj9cgaSzwCUqYfDIJ9FIHnhJYmDM4H_y4A&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar

    // const testing = await axios.get(
    //   `http://localhost:3000/home/oauthcallback?code={authorizationCode}`
    // );
    // console.log(testing.data);

    // const { tokens } = await oauth2Client.getToken(code);
    // console.log(tokens);

    // const testing = await axios.get(
    //   `https://dev-e27oql725amd8bwx.us.auth0.com/authorize?response_type=token&client_id=R91sYprWrLnH8ZVQbYtV8AAhyUmgymRR&connection=google-oauth2&redirect_uri=http://localhost:3000/api/auth/callback`
    // );

    // console.log("Testing : ", testing);

    const managementApi = await axios.post(
      `https://dev-e27oql725amd8bwx.us.auth0.com/oauth/token`,
      {
        client_id: "R91sYprWrLnH8ZVQbYtV8AAhyUmgymRR",
        client_secret:
          "IUAbul5dCEA9VtwyqafTeZj0XqfSNxDOHAyozwktLKe8V-6-xSMrl-Yy48SFFeA_",
        audience: "https://dev-e27oql725amd8bwx.us.auth0.com/api/v2/",
        grant_type: "client_credentials",
        // access_type: "offline",
        // scope: scopes,
      }
    );

    // console.log(managementApi.data);
    const token = managementApi.data.access_token;
    // console.log(token);

    const user = await axios.get(
      `https://dev-e27oql725amd8bwx.us.auth0.com/api/v2/users/${sub}|${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // console.log(user.data);
    // console.log(user.data.identities[0].access_token);

    const calendarList = await fetchGoogleCalendarList(
      user.data.identities[0].access_token
    );

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

    const events = [];
    const fetchPromises = selectedCalendarIds.map(async (item) => {
      const calendarEvent = await fetchGoogleEventList(
        user.data.identities[0].access_token,
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
