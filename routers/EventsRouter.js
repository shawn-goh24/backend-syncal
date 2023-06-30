const express = require("express");
const eventsController = require("../controllers/EventsController");

const router = express.Router();

router.get("/:id", eventsController.getEvents); // Get all events associated with user and calendar

module.exports = router;
