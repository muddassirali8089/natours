import User from "../models/user.model.js"; // adjust path as needed
import Review from "../models/review.model.js";
import catchAsync from "../controllers/catchAsync.js";
import AppError from "../utils/AppError.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";
import { signToken } from "../utils/jwt.js";

import { sendVerificationEmail } from "../controllers/sendVerificationEmail.js";
import { verifyEmail } from "../controllers/verifyEmail.js";

export const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Cookie options
  const cookieOptions = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
    httpOnly: true, // cookie can't be accessed via JS (XSS protection)
    secure: process.env.NODE_ENV === "production", // send over HTTPS in production
    sameSite: "strict", // CSRF protection
  };

  // Set cookie
  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  // Send response
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
export const signup = catchAsync(async (req, res, next) => {
  const result = await User.handleSignup(req, req.body, sendVerificationEmail);

  res.status(result.status === "new" ? 201 : 200).json({
    status: "success",
    message: result.message,
  });
});



export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password +isVerified");
  const isCorrect =
    user && (await user.correctPassword(password, user.password));

  if (!user || !isCorrect) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) Check if user is verified
  if (!user.emailVerified) {
    
    // Generate a new token
    const verificationToken = user.createEmailVerificationToken();

    await user.save({ validateBeforeSave: false });

    // Send verification email
    await sendVerificationEmail(req, user, verificationToken);

    return next(
      new AppError(
        "Your account is not verified. A new verification email has been sent.please verify the email it will auto login you.",
        403
      )
    );
  }

  // 4) If everything ok and verified, send token to client
  createSendToken(user, 200, res);
});

// ✅ Logout user
export const logout = catchAsync(async (req, res, next) => {
  // Clear the JWT cookie by setting it to expire immediately
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // Expires in 10 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});




// export const signup = catchAsync(async (req, res, next) => {
//   // const { name, email, password, confirmPassword  } = req.body;

//   const newUser = await User.create(req.body);

//   createSendToken(newUser, 201, res);
// });

// export const login = catchAsync(async (req, res, next) => {
//   const { email, password } = req.body;

//   // 1) Check if email and password exist
//   if (!email || !password) {
//     return next(new AppError("Please provide email and password!", 400));
//   }

//   // 2) Check if user exists && password is correct
//   const user = await User.findOne({ email }).select("+password");
//   const isCorrect =
//     user && (await user.correctPassword(password, user.password));

//   if (!user || !isCorrect) {
//     return next(new AppError("Incorrect email or password", 401));
//   }

//   // 3) If everything ok, send token to client
//   createSendToken(user, 200, res);
// });

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

  // 3) Check if user still exists and is active
  const currentUser = await User.findById(decoded.id).select('+active');
  
  if (!currentUser || !currentUser.active) {
    return next(
      new AppError("The user belonging to this token no longer exists or has been deactivated.", 401)
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

// ✅ Authorization middleware - check if user owns the resource
export const checkOwnership = (Model) =>
  catchAsync(async (req, res, next) => {
    // Find the document by ID
    const doc = await Model.findById(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    // Check if the logged-in user owns this document
    // For reviews: doc.user should equal req.user.id
    // For users: doc._id should equal req.user.id
    const isOwner = doc.user 
      ? doc.user.toString() === req.user.id 
      : doc._id.toString() === req.user.id;

    if (!isOwner && !req.user.roles.includes('admin')) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  });

// ✅ Authorization middleware specifically for reviews
export const checkReviewOwnership = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  // 🔍 Debug: Log the IDs for comparison
  console.log("🔍 Review ownership check:");
  console.log("Review user:", review.user);
  
  // Handle both populated and non-populated user field
  const reviewUserId = review.user._id ? review.user._id.toString() : review.user.toString();
  const currentUserId = req.user.id || req.user._id;
  
  console.log("Review user ID:", reviewUserId);
  console.log("Current user ID:", currentUserId.toString());
  console.log("User roles:", req.user.roles);

  // Check if user owns this review OR is admin
  const isOwner = reviewUserId === currentUserId.toString();
  const isAdmin = req.user.roles.includes('admin');

  console.log("Is owner:", isOwner);
  console.log("Is admin:", isAdmin);

  if (!isOwner && !isAdmin) {
    return next(
      new AppError("You can only delete your own reviews", 403)
    );
  }

  console.log("✅ Authorization passed for review deletion");
  next();
});

// ✅ Authorization middleware for review updates - allows users to modify their own reviews
export const checkReviewUpdateOwnership = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("No review found with that ID", 404));
  }

  // Handle both populated and non-populated user field
  const reviewUserId = review.user._id ? review.user._id.toString() : review.user.toString();
  const currentUserId = req.user.id || req.user._id;

  // Allow users to update their own reviews, admins can update any review
  const isOwner = reviewUserId === currentUserId.toString();
  const isAdmin = req.user.roles.includes('admin');

  if (!isOwner && !isAdmin) {
    return next(
      new AppError("You can only update your own reviews", 403)
    );
  }

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

  // Create frontend URL for password reset
  const frontendURL = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetURL = `${frontendURL}/reset-password/${resetToken}`;
  
  // Create HTML email template
  const htmlMessage = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password - Natours</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #55c57a;
          margin-bottom: 10px;
        }
        .title {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
        }
        .content {
          margin-bottom: 30px;
        }
        .button {
          display: inline-block;
          background-color: #55c57a;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          text-align: center;
          margin: 20px 0;
        }
        .button:hover {
          background-color: #2e864b;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 14px;
          color: #666;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🏔️ Natours</div>
          <h1 class="title">Reset Your Password</h1>
        </div>
        
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password for your Natours account.</p>
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetURL}" class="button">Reset Password</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This link will expire in 10 minutes for security reasons.
          </div>
          
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${resetURL}
          </p>
        </div>
        
        <div class="footer">
          <p><strong>Didn't request this?</strong></p>
          <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>For security reasons, please don't share this email with anyone.</p>
          <hr>
          <p>Best regards,<br>The Natours Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  // Plain text fallback
  const textMessage = `Forgot your password? Click the link below to reset your password:\n\n${resetURL}\n\nThis link is valid for 10 minutes.\n\nIf you didn't request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Your Password - Natours",
      message: htmlMessage,
      text: textMessage,
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
  
  // Validate the password before saving
  try {
    await user.validate();
  } catch (validationError) {
    return next(new AppError(validationError.message, 400));
  }
  
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
