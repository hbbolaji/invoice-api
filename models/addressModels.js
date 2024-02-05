const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    streetAddress: {
      type: String,
      trim: true,
      required: [true, "Street address is required"],
    },
    city: {
      type: String,
      trim: true,
      required: [true, "city is required"],
    },
    postCode: String,
    country: String,
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

const Address = mongoose.model("Address", AddressSchema);
module.exports = Address;
