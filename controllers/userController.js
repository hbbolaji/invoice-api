const User = require("./../models/userModels");
const catchAsync = require("./../utils/CatchAsync");

const filterObject = (body, ...fields) => {
  const newObj = {};
  Object.keys(body).forEach((el) => {
    if (fields.includes(el)) newObj[el] = body[el];
  });
  return newObj;
};

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  const length = await User.countDocuments();
  res.status(200).json({
    message: "success",
    length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // return error if user tries to update password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new Error("this route is not for password update"));
  }

  const filteredBody = filterObject(req.body, "name", "email", "address");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
