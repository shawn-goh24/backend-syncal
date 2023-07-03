const express = require("express");
const eventsController = require("../controllers/EventsController");

const router = express.Router();

router.post("/add", eventsController.addEvent); // Add event
router.put("/edit/:eventId", eventsController.editEvent); // Edit a single event
router.delete("/delete/:eventId/:calendarId", eventsController.deleteEvent); // Delete a single event

module.exports = router;
