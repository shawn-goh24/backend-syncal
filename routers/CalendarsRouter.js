const express = require("express");
const calendarsController = require("../controllers/CalendarsController");

const router = express.Router();

router.get("/:id", calendarsController.getCalendarEvents); // Get all events associated with user and calendar

module.exports = router;
