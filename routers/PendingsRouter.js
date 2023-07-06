const express = require("express");
const pendingsController = require("../controllers/PendingsController");

const router = express.Router();

router.get("/:email/:calendarId", pendingsController.getPendings); // Test route
router.post("/add", pendingsController.insertPendingInvites); // Test route
router.delete("/delete/:email/:calendarId", pendingsController.deletePending);

module.exports = router;
