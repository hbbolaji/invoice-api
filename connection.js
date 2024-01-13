const mongoose = require("mongoose");

const connection = async (uri) => {
  try {
    await mongoose.connect(uri, {});
    console.log("DB connected");
  } catch (error) {
    return error;
  }
};

module.exports = connection;
