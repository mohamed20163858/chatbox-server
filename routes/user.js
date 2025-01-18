const express = require("express");

// controller functions
const {
  loginUser,
  signupUser,
  checkUser,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// check user route
router.post("/check", checkUser);

module.exports = router;
