const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModels");
const sendEmail = require("./../utils/email");

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
      role: req.body.role,
    });
    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      token,
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

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // check if there is token
    if (!token) {
      next(new Error("No you are not logged in"));
    }

    // verify token
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

    // check if the user exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      next(new Error("The user no longer exist"));
    }

    // check if password has changed
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      next(new Error("User recently changed password, Please log in again"));
    }
    // grant access to protected route
    req.user = freshUser;
    next();
  } catch (error) {}
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        next(new Error("You are have permission to perform this action"));
      }
      next();
    } catch (error) {}
  };

exports.forgetPassword = async (req, res, next) => {
  try {
    // find user
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      next(new Error("no user with this email address"));
    }

    // generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    console.log(resetToken);

    // send token to the user's email
    await sendEmail({
      to: "",
      subject: "",
      message: "",
    });
    res.status(200).jsonn({
      status: "success",
      message: "token sent to mail",
    });
  } catch (error) {}
};

exports.resetPassword = (req, res, next) => {
  try {
  } catch (error) {}
};

exports.updatePassword = async (req, res, next) => {
  try {
    // check user
    const user = await User.findById(req.user.id).select("+password");
    // check passowrd
    if (!(await user.correctPassword(req.body.password, user.password))) {
      return next(new Error("Incorrect password"));
    }
    // update and save password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    const token = signToken(user.id);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {}
};
