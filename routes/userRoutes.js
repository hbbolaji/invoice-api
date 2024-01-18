const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
} = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget", forgetPassword);
router.post("/reset", resetPassword);

module.exports = router;
