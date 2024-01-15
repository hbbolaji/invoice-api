const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validator.isEmail, "A valid email is required"],
  },
  photo: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
    trim: true,
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Name field is required"],
    trim: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
