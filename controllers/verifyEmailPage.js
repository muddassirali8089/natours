import crypto from "crypto";
import User from "../models/user.model.js";
import catchAsync from "./catchAsync.js";

export const verifyEmailPage = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  
  console.log("🔍 Email verification page called with token:", token);
  
  try {
    // Verify the token on the server side
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("🔍 Hashed token:", hashedToken);
    console.log("🔍 Current time:", Date.now());

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    console.log("🔍 User found:", user ? user.email : "No user found");

    if (!user) {
      // Debug: Check if any user has this token (even expired)
      const expiredUser = await User.findOne({
        emailVerificationToken: hashedToken
      });
      
      if (expiredUser) {
        console.log("❌ Token expired for user:", expiredUser.email);
        console.log("❌ Expiry time:", expiredUser.emailVerificationExpires);
        console.log("❌ Current time:", Date.now());
        console.log("❌ Is expired?", expiredUser.emailVerificationExpires < Date.now());
      }
      
      // Token invalid - show error page
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Verification Failed</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 50px; 
                background: #f5f5f5;
              }
              .container {
                background: white;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 500px;
                margin: 0 auto;
              }
            </style>
        </head>
        <body>
            <div class="container">
              <h2 style="color: red;">❌ Verification Failed</h2>
              <p>Invalid or expired verification link.</p>
              <p><small>The link may have expired or already been used.</small></p>
              <p>Please request a new verification email from the application.</p>
            </div>
        </body>
        </html>
      `);
    }

    // Token valid - update user and show success
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log("✅ Email verified successfully for:", user.email);

    // Show success page WITHOUT redirection
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Email Verified</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              max-width: 500px;
              margin: 0 auto;
            }
            .success-check {
              color: green;
              font-size: 48px;
              margin-bottom: 20px;
            }
          </style>
      </head>
      <body>
          <div class="container">
            <div class="success-check">✅</div>
            <h2 style="color: green; margin-bottom: 20px;">Email Verified Successfully!</h2>
            <p style="font-size: 18px; margin-bottom: 10px;">Your account has been successfully verified.</p>
            <p style="font-size: 16px; color: #666;">You can now login to the application.</p>
          </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error("❌ Verification error:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);
    
    // Show error page
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
          <title>Verification Error</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 50px; 
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 40px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              max-width: 500px;
              margin: 0 auto;
            }
          </style>
      </head>
      <body>
          <div class="container">
            <h2 style="color: red;">❌ Verification Error</h2>
            <p>Something went wrong during verification.</p>
            <p>Please try again or contact support.</p>
          </div>
      </body>
      </html>
    `);
  }
});