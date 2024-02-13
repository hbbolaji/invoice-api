const mongoose = require("mongoose");
const catchAsync = require("./utils/CatchAsync");

const connection = catchAsync(async (uri) => {
  await mongoose.connect(uri, {});
  console.log("DB connected");
});

module.exports = connection;
