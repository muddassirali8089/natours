import crypto from "crypto";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../controllers/catchAsync.js";
import { createSendToken } from "../controllers/authContrller.js";
export const verifyEmail = catchAsync(async (req, res, next) => {
  // 1️⃣ Hash the token from URL
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("🔍 Email verification debugging:");
  console.log("Token from URL:", req.params.token);
  console.log("Hashed token:", hashedToken);
  console.log("Current time:", Date.now());

  // 2️⃣ Find user with token and check expiration
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    // 🔍 DEBUG: Let's see what users exist with this token
    const userWithToken = await User.findOne({
      emailVerificationToken: hashedToken
    });
    
    if (userWithToken) {
      console.log("❌ User found but token expired:");
      console.log("User email:", userWithToken.email);
      console.log("Token expires at:", userWithToken.emailVerificationExpires);
      console.log("Current time:", Date.now());
      console.log("Token expired:", userWithToken.emailVerificationExpires < Date.now());
      console.log("Time difference:", Date.now() - userWithToken.emailVerificationExpires, "ms");
    } else {
      console.log("❌ No user found with this exact token");
      
      // Let's see what verification tokens exist
      const allTokens = await User.find({
        emailVerificationToken: { $exists: true }
      }).select('email emailVerificationToken emailVerificationExpires');
      console.log("All users with tokens:", allTokens);
    }
    
    return next(new AppError("Token is invalid or has expired", 400));
  }

  console.log("✅ User found:", user.email);
  console.log("✅ Token is valid and not expired");

  // 3️⃣ Mark email as verified and remove token fields
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  console.log("✅ Email verified successfully");

  // 4️⃣ Auto login user by sending JWT
  createSendToken(user, 200, res);
});
