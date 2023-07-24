const express = require("express");
const usersController = require("../controllers/UsersController");

const router = express.Router();

router.post("/", usersController.getUser); // Check & get single user
router.get("/group/:id", usersController.getGroup); // Get calendar associated with user
router.put("/:userId", usersController.editUser); // Edit user

module.exports = router;
