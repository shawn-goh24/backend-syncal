const express = require("express");
const pendingsController = require("../controllers/PendingsController");

const router = express.Router();

router.post("/add", pendingsController.insertPendingInvites); // Test route

module.exports = router;
