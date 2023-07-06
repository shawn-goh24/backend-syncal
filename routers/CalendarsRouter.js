const express = require("express");
const calendarsController = require("../controllers/CalendarsController");

const router = express.Router();

router.get(
  "/usercalendar/:userId/:calendarId",
  calendarsController.getUserCalendar
); // Get all events associated with user and calendar
router.get("/:id", calendarsController.getCalendarEvents); // Get all events associated with user and calendar
router.get("/:id/list", calendarsController.getEventList); // Get all events list associated with user and calendar
router.post("/add", calendarsController.addCalendar); // Add new calendar
router.put("/edit/:calendarId/:userId", calendarsController.editCalendar); // Edit a single calendar
router.delete(
  "/delete/:calendarId/:userId",
  calendarsController.deleteCalendar
); // Delete a single calander

router.get("/invite/:id", calendarsController.getInviteDetails); // Get invite details
router.post("/invite", calendarsController.sendInvite); // Invite members to calendar
router.post("/new/usercalendar", calendarsController.addToUserCalendar);

router.delete("/leave/:calendarId/:userId", calendarsController.leaveCalendar);

module.exports = router;
