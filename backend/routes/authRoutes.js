const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const { check } = require("express-validator");

// router.post("/register", registerUser);
router.post(
  "/register",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  registerUser
);

// router.post("/login", loginUser);
router.post(
  "/login",
  [
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

module.exports = router;
