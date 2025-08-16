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

  // 2️⃣ Find user with token and check expiration
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // 3️⃣ Mark email as verified and remove token fields
  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // 4️⃣ Auto login user by sending JWT
  createSendToken(user, 200, res);
});
