const express = require("express");
const googleCalController = require("../controllers/GoogleCalController");

const router = express.Router();

router.get("/rfurl", googleCalController.oauthLogin); // handle get url from google
router.post("/rf", googleCalController.getRf); // handle get user google details (RF/Access token)
router.get("/:sub/:id/:userId", googleCalController.getGoogleCalendarList); // Retreive a list of calendar associated with the user
router.post("/:sub/:id/:userId", googleCalController.getSelectedCalEvents); // Retreive a list of events associated with the user and calendar

module.exports = router;
