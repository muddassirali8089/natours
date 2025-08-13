// utils/email.js
import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  // 1. Create transporter for Mailtrap
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Mailtrap SMTP
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.MAILTRAP_USER, // from Mailtrap dashboard
      pass: process.env.MAILTRAP_PASS, // from Mailtrap dashboard
    },
  });

  // 2. Email options
  const mailOptions = {
    from: "Muddassir Ali <no-reply@example.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. Send email
  await transporter.sendMail(mailOptions);
};
