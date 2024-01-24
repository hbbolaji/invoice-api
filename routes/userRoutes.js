const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  resetPassword,
  updatePassword,
  protect,
} = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forget", forgetPassword);
router.post("/reset", protect, resetPassword);
router.patch("/updateMyPassword", updatePassword);

module.exports = router;
