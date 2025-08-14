import User from '../models/user.model.js';
import catchAsync from './catchAsync.js';
import AppError from '../utils/AppError.js';

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
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  // 2. Update the user (whatever fields they pass, except password)
 
  
  const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
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



export const getUser = (req, res) => {
  return res.status(500).json({
    status: "err",
    message: "user is route is not define",
  });
};


export const createUser = (req, res) => {
  return res.status(500).json({
    status: "err",
    message: "user is route is not define",
  });
};

export const deleteUser = (req, res) => {
  return res.status(500).json({
    status: "err",
    message: "user is route is not define",
  });
};

export const updateUser = (req, res) => {
  return res.status(500).json({
    status: "err",
    message: "user is route is not define",
  });
};
