import User from '../models/user.model.js';
import catchAsync from './catchAsync.js';
import AppError from '../utils/AppError.js';
import { deleteOne, updateOne } from './handlerFactory.js';
import { sendVerificationEmail } from './sendVerificationEmail.js';
import cloudinary from '../utils/cloudinary.js';
import streamifier from 'streamifier';

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
  try {
    const userId = req.user.id;
    const { name } = req.body || {};

    console.log('Update Profile Request:', {
      userId,
      body: req.body,
      hasFile: !!req.file,
      fileType: req.file?.mimetype
    });

    // Block password updates
    if ((req.body && req.body.password) || (req.body && req.body.confirmPassword)) {
      return next(
        new AppError("This route is not for password updates. Please use /updateMyPassword", 400)
      );
    }

    // Check for invalid fields
    const allowedFields = ['name'];
    const invalidFields = Object.keys(req.body || {}).filter(field => 
      !allowedFields.includes(field) && 
      field !== 'password' && 
      field !== 'confirmPassword'
    );
    
    if (invalidFields.length > 0) {
      console.log('❌ Invalid fields detected:', invalidFields);
      return next(new AppError(`Invalid fields: ${invalidFields.join(', ')}. Only name and profileImage are allowed.`, 400));
    }

    if (!name && !req.file) {
      return next(new AppError("Provide at least one field to update!", 400));
    }

    const updateData = {};

    if (name) updateData.name = name;

    if (req.file) {
      console.log('Processing image upload...');
      // Upload new image to Cloudinary
      const uploadedImage = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "users", // store profile images under users folder
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              console.log('Image uploaded successfully:', result.secure_url);
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
      });

      updateData.photo = uploadedImage.secure_url; // Store in 'photo' field of model
    }

    console.log('Updating user with data:', updateData);

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    console.log('User updated successfully:', updatedUser._id);

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return next(error);
  }
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
