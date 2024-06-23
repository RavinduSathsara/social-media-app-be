const express = require("express");
const router = express.Router();
const auth = require("../middleware/Auth");

const { registerUser, loginUser } = require("../controllers/Auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
