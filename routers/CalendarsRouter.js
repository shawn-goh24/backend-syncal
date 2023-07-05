const express = require("express");
const calendarsController = require("../controllers/CalendarsController");

const router = express.Router();

router.get("/:id", calendarsController.getCalendarEvents); // Get all events associated with user and calendar
router.get("/:id/list", calendarsController.getEventList); // Get all events list associated with user and calendar
router.post("/add", calendarsController.addCalendar); // Add new calendar
router.put("/edit/:calendarId/:userId", calendarsController.editCalendar); // Edit a single calendar
router.delete(
  "/delete/:calendarId/:userId",
  calendarsController.deleteCalendar
); // Delete a single calander

module.exports = router;
