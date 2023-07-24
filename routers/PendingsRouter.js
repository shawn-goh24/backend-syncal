const express = require("express");
const pendingsController = require("../controllers/PendingsController");

const router = express.Router();

router.get("/:email/:calendarId", pendingsController.getPendings); // get pending associatedd with user and calendar
router.post("/add", pendingsController.insertPendingInvites); // insert user and calendar to pending table
router.delete("/delete/:email/:calendarId", pendingsController.deletePending); // delete pending

module.exports = router;
