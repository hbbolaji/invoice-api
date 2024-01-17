const mongoose = require("mongoose");
const validator = require("validator");

const invoiceSchema = new mongoose.Schema({
  merchantAddress: {
    type: String,
    required: [true, "Merchant Address is needed"],
  },
  clientAddress: {
    type: String,
    required: [true, "Client Address is required"],
  },
  clientName: {
    type: String,
    required: [true, "Client Name is required"],
  },
  clientEmail: {
    type: String,
    required: [true, "Client Email is required"],
    validate: [validator.isEmail, "A valid email is required"],
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
