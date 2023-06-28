const express = require("express");
const usersController = require("../controllers/UsersController");

const router = express.Router();

router.get("/", usersController.testRoute); // Test route
router.post("/", usersController.getUser); // Get logged in user (User ? continue : add to db)

module.exports = router;
