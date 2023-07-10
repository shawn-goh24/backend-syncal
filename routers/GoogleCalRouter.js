const express = require("express");
const googleCalController = require("../controllers/GoogleCalController");

const router = express.Router();

router.get("/:sub/:id", googleCalController.getGoogleCalendarList);

module.exports = router;
