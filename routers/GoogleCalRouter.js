const express = require("express");
const googleCalController = require("../controllers/GoogleCalController");

const router = express.Router();

router.get("/rfurl", googleCalController.oauthLogin);
router.post("/rf", googleCalController.getRf);
router.get("/:sub/:id/:userId", googleCalController.getGoogleCalendarList);
router.post("/:sub/:id", googleCalController.getSelectedCalEvents);

module.exports = router;
