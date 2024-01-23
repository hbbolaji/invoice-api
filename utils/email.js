const nodemailer = require("nodemailer");

const sendEmail = (options) => {
  // create transporter
  const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.PASSWORD_USERNAME,
    },
  });

  // define email options

  // send email
};
