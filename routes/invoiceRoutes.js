const express = require("express");
const {
  getInvoice,
  getInvoices,
  createInvoice,
  updateInvoice,
} = require("./../controllers/invoiceController");
const { protect, restrictTo } = require("./../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(protect, restrictTo("admin"), getInvoices)
  .post(protect, createInvoice);
router.route("/:id").get(getInvoice).patch(protect, updateInvoice);

module.exports = router;
