const express = require("express");
const {
  getInvoice,
  getInvoices,
  createInvoice,
} = require("./../controllers/invoiceController");
const { protect } = require("./../controllers/authController");

const router = express.Router();

router.route("/").get(protect, getInvoices).post(createInvoice);
router.route("/:id").get(getInvoice);

module.exports = router;
