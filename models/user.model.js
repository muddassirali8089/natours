import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"; // ✅ import bcryptjs
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    trim: true,
  },
  roles: {
    type: [String],
    enum: ["user", "admin", "lead-guide", "guide"],
    default: ["user"],
  },
  email: {
    type: String,
    required: [true, "User must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // Only works on SAVE and CREATE
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,

  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// 🚀 DATABASE INDEXES FOR PERFORMANCE OPTIMIZATION

// 1. Index for email (most critical for authentication)
userSchema.index({ email: 1 }, { unique: true }); // Unique index for email

// 2. Index for password reset functionality
userSchema.index({ passwordResetToken: 1 });
userSchema.index({ passwordResetExpires: 1 });

// 3. Index for email verification
userSchema.index({ emailVerificationToken: 1 });
userSchema.index({ emailVerificationExpires: 1 });

// 4. Compound index for active users lookup
userSchema.index({ active: 1, emailVerified: 1 });

// 5. Index for role-based queries
userSchema.index({ roles: 1 });

// 6. Text search index for user names
userSchema.index({ name: "text" });

// ✅ PRE-SAVE MIDDLEWARE to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it's been modified or is new
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12 (salt rounds)
  this.password = await bcrypt.hash(this.password, 12);

  // Remove confirmPassword (won't be saved in DB)
  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  // Exclude inactive users from any find query
  this.find({ active: { $ne: false } });
  next();
});


userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.emailVerificationExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return verificationToken; // send this token in email
};


userSchema.methods.createPasswordResetToken = function () {
  // 1. Create a random token (unhashed)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash it and store in DB
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set expiration time (10 minutes from now)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // 4. Return plain token (email to user)
  return resetToken;
};

userSchema.pre("save", function (next) {
  // Only set when password is modified and NOT on new user creation
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // subtract 1 sec to avoid token issues
  next();
});

// INSTANCE METHOD to validate password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ✅ Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp; // true means password was changed
  }
  return false; // false means password not changed after JWT issued
};


userSchema.statics.handleSignup = async function (req, userData, sendVerificationEmail) {

  const { email } = userData;

  let user = await this.findOne({ email });

  if (user) {
    if (user.emailVerified) {
      const err = new Error("Email already registered. Please login instead.");
      err.statusCode = 400;
      err.isOperational = true;
      throw err;
    }

    const token = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(req, user, token); // ✅ now user is defined
    return { status: "pending", message: "Verification link resent" };
  }

  // Create new user
  user = await this.create(userData);

  const token = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(req, user, token); // ✅ now user is defined
  return { status: "new", message: "your account has been created. please verify the email through link." };
};




const User = mongoose.model("User", userSchema);
export default User;
