const express = require("express");
const eventsController = require("../controllers/EventsController");

const router = express.Router();

router.get("/userevent/:eventId/:userId", eventsController.getEventWithUser); // Get userevent table details
router.get("/userevent/:eventId/", eventsController.getUsersInEvent); // get event associated with user
router.get("/rsvpcount/:eventId", eventsController.getRsvpCount); // get rsvp count from the event
router.put("/userevent/:eventId/:userId", eventsController.editEventWithUser); // Edit userevent table
router.post("/add", eventsController.addEvent); // Get add event - 1. add to Event table, 2. add to UserEvent table
router.put("/edit/:eventId", eventsController.editEvent); // Edit a single event
router.delete("/delete/:eventId/:calendarId", eventsController.deleteEvent); // Delete a single event

module.exports = router;
