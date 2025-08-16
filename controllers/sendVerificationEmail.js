import { sendEmail } from "../utils/email.js";
export const sendVerificationEmail = async (req, user, token) => {
  // Build verification URL dynamically from backend host
  const verificationURL = `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${token}`;

  const message = `Please verify your email by clicking this link: ${verificationURL}.
This link will expire in 10 minutes.`;

  await sendEmail({
    email: user.email,
    subject: "Verify your email",
    message,
  });
};
