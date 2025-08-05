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
