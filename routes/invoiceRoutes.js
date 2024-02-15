const express = require("express");
const {
  getInvoice,
  getInvoices,
  createInvoice,
  updateInvoice,
  getMyInvoices,
} = require("./../controllers/invoiceController");
const { protect, restrictTo } = require("./../controllers/authController");

const router = express.Router();
// restrictTo("admin"),

router.route("/me").get(protect, getMyInvoices);
router
  .route("/")
  .get(protect, restrictTo("admin"), getInvoices)
  .post(protect, createInvoice);
router.route("/:id").get(protect, getInvoice).patch(protect, updateInvoice);

module.exports = router;
