const express = require("express");
const { protect } = require("./../controllers/authController");
const { createAddress } = require("./../controllers/addressController");

const router = express.Router();

router.route("/me").post(protect, createAddress);

module.exports = router;
