const mongoose = require("mongoose");
const validator = require("validator");

const invoiceSchema = new mongoose.Schema({
  merchant: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Merchant is needed"],
  },
  client: {
    type: mongoose.Schema.ObjectId,
    required: [true, "Client is required"],
  },
  invoiceDate: {
    type: Date,
    required: [true, "Date is required"],
  },
  paymentTerms: {
    type: String,
    required: [true, "Payment Terms is required"],
  },
  projectDescription: String,
  status: {
    type: String,
    enum: ["Paid", "Pending", "Draft"],
    default: "Draft",
  },
  itemList: [
    {
      itemName: {
        type: String,
        required: [true, "Item Name is required"],
      },
      quantity: {
        type: Number,
        default: 1,
      },
      price: {
        type: Number,
        required: [true, "Price is required"],
      },
    },
  ],
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
