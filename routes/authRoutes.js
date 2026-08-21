const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/authValidation");

// Register
router.post(
  "/register",
  validateRegister,
  registerUser
);

// Login
router.post(
  "/login",
  validateLogin,
  loginUser
);

// Current user
router.get("/me", protect, getMe);

module.exports = router;