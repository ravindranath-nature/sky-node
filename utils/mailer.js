const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true, 
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD
  }
});

exports.sendMail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: process.env.FROM_NAME,
    to,
    subject,
    html
  });
};
