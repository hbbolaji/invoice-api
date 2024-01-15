const jwt = require("jsonwebtoken");
const User = require("./../models/userModels");

exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      photo: req.body.photo,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.SECRET,
      { expiresIn: process.env.EXPIRES_IN }
    );

    res.status(201).json({
      status: "success",
      token: `Bearer ${token}`,
      data: newUser,
    });
  } catch (error) {}
};
