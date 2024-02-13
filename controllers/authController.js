const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("./../models/userModels");
const sendEmail = require("./../utils/email");
const catchAsync = require("../utils/CatchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};

const createSendToken = (user, res) => {
  const token = signToken(user._id);
  // res.cookie("jwt", token, {
  //   expires: new Date(
  //     Date.now + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //   ),
  //   secure: false,
  //   httpOnly: true,
  // });
  user.password = undefined;
  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    photo: req.body.photo,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  createSendToken(newUser, res);
});

exports.login = catchAsync(async (req, res, next) => {
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
  createSendToken(user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
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
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(new Error("You do not have permission to perform this action"));
    }
    next();
  };

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // find user
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    next(new Error("no user with this email address"));
  }

  // generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

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
});

exports.resetPassword = catchAsync(async (req, res, next) => {});

exports.updatePassword = catchAsync(async (req, res, next) => {
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

  createSendToken(user, res);
});
