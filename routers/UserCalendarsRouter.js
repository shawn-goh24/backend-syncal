const express = require("express");
const userCalendarsController = require("../controllers/UserCalendarsController");

const router = express.Router();

router.put(
  "/editcolor/:userId/:calendarId",
  userCalendarsController.editDefaultColor
); // Edit color from userscalendar table

module.exports = router;
