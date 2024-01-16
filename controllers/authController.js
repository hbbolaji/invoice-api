const jwt = require("jsonwebtoken");
const User = require("./../models/userModels");
const { MongoError } = require("mongodb");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      photo: req.body.photo,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      token: `Bearer ${token}`,
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // check if there is email and password
    if (!email || !password) {
      return next(new Error("please provide email and password"));
    }
    // check if user exist
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new Error("Incorrect Email or Password"));
    // generate token
    const token = signToken(user._id);
    // send token
    res.status(200).json({
      message: "success",
      token,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};
