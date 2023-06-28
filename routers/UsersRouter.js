const express = require("express");
const usersController = require("../controllers/UsersController");

const router = express.Router();

router.get("/", usersController.testRoute); // Test route
router.post("/", usersController.getUser); // Get logged in user (User ? continue : add to db)
router.get("/group/:id", usersController.getGroup); // Get calendar associated with user

module.exports = router;
