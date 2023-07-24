// imports
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Auth0
const { auth } = require("express-oauth2-jwt-bearer");
const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

const usersRouter = require("./routers/UsersRouter");
const eventsRouter = require("./routers/EventsRouter");
const calendarsRouter = require("./routers/CalendarsRouter");
const pendingsRouter = require("./routers/PendingsRouter");
const googleCalRouter = require("./routers/GoogleCalRouter");
const userCalendarsRouter = require("./routers/UserCalendarsRouter");

// enforce on all endpoints
// get PORT from .env
const PORT = process.env.PORT;
// instantiate express
const app = express();
app.use(cors());
app.use(express.json());
app.use(checkJwt);

app.use("/user", usersRouter);
app.use("/event", eventsRouter);
app.use("/calendar", calendarsRouter);
app.use("/pending", pendingsRouter);
app.use("/googleCal", googleCalRouter);
app.use("/usercalendar", userCalendarsRouter);

app.listen(PORT, () => {
  console.log(`Application listening to port ${PORT}`);
});
