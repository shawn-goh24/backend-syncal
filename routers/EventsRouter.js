const express = require("express");
const eventsController = require("../controllers/EventsController");

const router = express.Router();

router.get("/userevent/:eventId/:userId", eventsController.getEventWithUser);
router.get("/userevent/:eventId/", eventsController.getUsersInEvent);
router.get("/rsvpcount/:eventId", eventsController.getRsvpCount);
router.put("/userevent/:eventId/:userId", eventsController.editEventWithUser);
router.post("/add", eventsController.addEvent); // Add event
router.put("/edit/:eventId", eventsController.editEvent); // Edit a single event
router.delete("/delete/:eventId/:calendarId", eventsController.deleteEvent); // Delete a single event

module.exports = router;
