const express = require("express");
const userCalendarsController = require("../controllers/UserCalendarsController");

const router = express.Router();

router.put(
  "/editcolor/:userId/:calendarId",
  userCalendarsController.editDefaultColor
);

module.exports = router;
