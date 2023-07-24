const express = require("express");
const calendarsController = require("../controllers/CalendarsController");

const router = express.Router();

router.get(
  "/usercalendar/:userId/:calendarId",
  calendarsController.getUserCalendar
); // User associated with calendar
router.get("/:id", calendarsController.getCalendarEvents); // Get all events within calendar
router.get("/:id/list", calendarsController.getEventList); // Get a list of events in calendar and group according to dates
router.post("/add", calendarsController.addCalendar); // Add calendar
router.put("/edit/:calendarId/:userId", calendarsController.editCalendar); // Edit calendar details
router.delete(
  "/delete/:calendarId/:userId",
  calendarsController.deleteCalendar
); // Delete a single calander
router.get("/invite/:id", calendarsController.getInviteDetails); // get a single calendar for invite details
router.post("/invite", calendarsController.sendInvite); // send invite to a particular calendar
router.post("/new/usercalendar", calendarsController.addToUserCalendar); // add user to usercalendar table
router.delete("/leave/:calendarId/:userId", calendarsController.leaveCalendar); // leave calendar
router.get("/users/:calendarId", calendarsController.getAllUsersInCalendar); // get all users within calendar

module.exports = router;
