const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.PASSWORD_USERNAME,
    },
  });

  // define email options
  const mailOptions = {
    from: "Hashim Bello <hello@invoice.com>",
    to: option.email,
    subject: option.subject,
    text: option.message,
  };
  // send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
