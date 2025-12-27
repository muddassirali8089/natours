// utils/emailTemplates.js

import { sendEmail } from "../utils/email.js";
export const sendVerificationEmail = async (req, user, token) => {
  // Use the GET route in email (not PATCH)
  const verificationURL = `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${token}`;

  const htmlMessage = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Verify Your Email Address</h2>
    <p>Please click the button below to verify your email address:</p>
    
    <a href="${verificationURL}" 
       style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0;">
      Verify Email
    </a>
    
    <p style="color: #666; font-size: 14px;">
      This link will expire in 10 minutes.
    </p>
    
    <p>If the button doesn't work, copy and paste this URL in your browser:</p>
    <p style="background: #f4f4f4; padding: 10px; border-radius: 5px; word-break: break-all;">
      ${verificationURL}
    </p>
  </div>
  `;

  await sendEmail({
    email: user.email,
    subject: "Verify your email address",
    message: htmlMessage,
  });
};