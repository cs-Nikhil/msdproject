const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);
  console.log('Email sent: ' + info.response);
};

module.exports = sendEmail;
