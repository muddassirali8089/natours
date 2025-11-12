// utils/email.js
import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  try {
    // Debugging: check if environment variables are loaded
    console.log("==== Email Debug Info ====");
    console.log("EMAIL_USER:", process.env.EMAIL_USER || "❌ Missing");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Exists" : "❌ Missing");
    console.log("===========================");

    // Step 1: Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Step 2: Verify transporter connection
    await transporter.verify().then(() => {
      console.log("✅ Gmail transporter verified successfully!");
    }).catch((err) => {
      console.error("❌ Transporter verification failed:", err.message);
    });

    // Step 3: Set email options
    const mailOptions = {
      from: `"Muddassir Ali" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.text || options.message,
      html: options.message,
    };

    // Step 4: Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
  } catch (error) {
    console.error("❌ Email sending failed!");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Full error stack:", error.stack);
    throw error;
  }
};




// export const sendEmail = async (options) => {
//   // 1. Create transporter for Mailtrap
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST, // Mailtrap SMTP
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.MAILTRAP_USER, // from Mailtrap dashboard
//       pass: process.env.MAILTRAP_PASS, // from Mailtrap dashboard
//     },
//   });

//   // 2. Email options
//   const mailOptions = {
//     from: "Muddassir Ali <no-reply@example.com>",
//     to: options.email,
//     subject: options.subject,
//     text: options.text || options.message,
//     html: options.message, // Use HTML message if provided
//   };

//   // 3. Send email
//   await transporter.sendMail(mailOptions);
// };


// import nodemailer from "nodemailer";

// export const sendEmail = async (options) => {
//   try {
//     // Validate required fields
//     if (!options?.email || !options.subject || !options.message) {
//       throw new Error("Missing required email options");
//     }

//     const transporter = nodemailer.createTransport({
//       host: "smtp.sendgrid.net",
//       port: 587,
//       secure: false,
//       auth: {
//         user: "apikey",
//         pass: process.env.SENDGRID_API_KEY,
//       },
//     });

//     const mailOptions = {
//       from: "Muddassir Ali <muddassirali8089@gmail.com>",
//       to: options.email,
//       subject: options.subject,
//       text: options.message,
//       // Consider adding HTML version too
//       html: options.html || options.message,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log("Message sent: %s", info.messageId);
//     return info;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error; // Re-throw to handle in calling code
//   }
// };

