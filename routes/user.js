const express = require("express");

// controller functions
const {
  loginUser,
  signupUser,
  checkUser,
  getToken,
  resetPassword,
} = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// check user route
router.post("/check", checkUser);

router.post("/forgot-password", getToken);

router.post("/reset-password", resetPassword);

module.exports = router;
