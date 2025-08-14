import User from "../models/user.model.js"; // adjust path as needed
import catchAsync from "../controllers/catchAsync.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";
import {signToken} from "../utils/jwt.js"


export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};


export const signup = catchAsync(async (req, res, next) => {
  // const { name, email, password, confirmPassword  } = req.body;

  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");
  const isCorrect =
    user && (await user.correctPassword(password, user.password));

  if (!user || !isCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // 4) (Optional) Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // 5) Grant access to protected route
  req.user = currentUser;
  next();
});

export const restrictTo = (...requiredRoles) => {
  return (req, res, next) => {
    // Debug: Log user and required roles
    console.log("\n--- ROLE VERIFICATION DEBUG ---");
    console.log("User:", req.user?.email || "Unknown user");
    console.log("User Roles:", req.user?.roles || "No roles found");
    console.log("Required Roles:", requiredRoles);

    // 1. Check if user exists and has roles
    if (!req.user?.roles) {
      console.error("ERROR: User or roles missing in request");
      return next(new AppError("Authentication required", 401));
    }

    // 2. Check role intersection (supports single role or array)
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : [req.user.roles];

    const hasPermission = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    // Debug: Result
    console.log("Permission Granted:", hasPermission ? "✅" : "❌");
    console.log("-------------------------------\n");

    // 3. Deny access if no match
    if (!hasPermission) {
      return next(
        new AppError(
          `Insufficient permissions. Required: ${requiredRoles.join(", ")}`,
          403
        )
      );
    }

    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("No user found with that email", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetURL}\nIf you didn't request this, ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1. Hash token from URL
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // 2. Find user with token and check expiry
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // not expired
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // 3. Set new password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // 4. Log in the user with new JWT

  createSendToken(user, 200, res);
});

export const updateMyPassword = catchAsync(async (req, res, next) => {
  // 1. Get user from DB with password
  const user = await User.findById(req.user.id).select("+password");

  // 2. Check if current password is correct
  const isCorrect = await user.correctPassword(
    req.body.currentPassword,
    user.password
  );

  if (!isCorrect) {
    return next(new AppError("Your current password is wrong", 401));
  }

  // 3. Set new password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmPassword;
  await user.save(); // triggers password hashing middleware

  // 4. Sign new JWT and send
  createSendToken(user, 200, res);
});

// export const restrictToAny = (...allowedRoles) => {
//   return (req, res, next) => {
//     const userRoles = req.user.roles || [];

//     const hasPermission = allowedRoles.some(role =>
//       userRoles.includes(role)
//     );

//     if (!hasPermission) {
//       return next(
//         new AppError(`Requires one of: ${allowedRoles.join(', ')}`, 403)
//       );
//     }
//     next();
//   };
// };
