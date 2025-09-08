import User from '../models/user.model.js';
import catchAsync from './catchAsync.js';
import AppError from '../utils/AppError.js';
import { deleteOne, updateOne } from './handlerFactory.js';
import { sendVerificationEmail } from './sendVerificationEmail.js';

export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ✅ Get current user
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});

// ✅ Get current user's reviews
export const getMyReviews = catchAsync(async (req, res, next) => {
  const Review = (await import('../models/review.model.js')).default;
  
  const reviews = await Review.find({ user: req.user.id })
    .populate('tour', 'name imageCover')
    .sort({ createdAt: -1 });
  
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users || users.length === 0) {
    return next(new AppError('No users found', 404));
  }

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});


export const updateMe = catchAsync(async (req, res, next) => {
  // 1. Block password updates here
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError("This route is not for password updates. Please use /updateMyPassword", 400)
    );
  }

  // 2. Filter body to allow only name & email
  const filteredBody = filterObj(req.body, "name", "email");

  // 3. Check if email is being changed
  const currentUser = await User.findById(req.user.id);
  const isEmailChanging = filteredBody.email && filteredBody.email !== currentUser.email;

  if (isEmailChanging) {
    // 4. If email is changing, require verification
    // Check if email already exists
    const existingUser = await User.findOne({ email: filteredBody.email });
    if (existingUser) {
      return next(new AppError("Email already in use", 400));
    }

    // Set email as unverified and create verification token
    filteredBody.emailVerified = false;
    const verificationToken = currentUser.createEmailVerificationToken();
    
    // 🔧 BUG FIX: Include the token fields from currentUser in the update
    filteredBody.emailVerificationToken = currentUser.emailVerificationToken;
    filteredBody.emailVerificationExpires = currentUser.emailVerificationExpires;
    
    // 🔍 DEBUG: Log what we're saving
    console.log("🔍 Email update debugging:");
    console.log("Plain token:", verificationToken);
    console.log("Hashed token:", currentUser.emailVerificationToken);
    console.log("Token expires at:", currentUser.emailVerificationExpires);
    console.log("Current time:", Date.now());
    console.log("Time until expiry:", currentUser.emailVerificationExpires - Date.now(), "ms");
    
    // Update user with new email AND token fields
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true
    });
    
    // 🔍 DEBUG: Verify the token was saved
    console.log("🔍 After update:");
    console.log("Updated user token:", updatedUser.emailVerificationToken);
    console.log("Updated user expires:", updatedUser.emailVerificationExpires);

    // Send verification email to NEW email address
    const tempUser = { ...updatedUser.toObject(), email: filteredBody.email };
    await sendVerificationEmail(req, tempUser, verificationToken);

    return res.status(200).json({
      status: "success",
      message: "Email updated successfully. Please check your new email for verification link to complete the process.",
      data: {
        user: updatedUser
      }
    });
  }

  // 5. If only name is being updated (no email change)
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
});

// Deactivate the currently logged-in user
export const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null
  });
};




export const getUser = catchAsync(async (req, res, next) => {
  // Example: get the ID from params (or you can use req.user.id if logged in)
  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new AppError('No user found with this ID', 404));
  }

  // Send user data back
  res.status(200).json({
    status: 'success',
    data: {
      user
    }
  });
});




export const createUser = (req, res) => {
  return res.status(500).json({
    status: "err",
    message: "user is route is not define",
  });
};

export const deleteUser = deleteOne(User);

// export const deleteUser = (req, res) => {
//   return res.status(500).json({
//     status: "err",
//     message: "user is route is not define",
//   });
// };

// ❌ REMOVED: Admin cannot update other users' personal info
// This function has been removed as per security requirements
// Admins can only manage their own profile via /updateMe

// export const updateUser = catchAsync(async (req, res, next) => {
//   // This functionality is intentionally disabled
//   // Admins cannot change other users' personal information
// });

// ✅ Admin can deactivate users (separate from delete)
export const deactivateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id, 
    { active: false }, 
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user
    }
  });
});
