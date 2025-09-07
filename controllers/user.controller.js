import User from '../models/user.model.js';
import catchAsync from './catchAsync.js';
import AppError from '../utils/AppError.js';
import { deleteOne, updateOne } from './handlerFactory.js';

export const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

  // 3. Update user document
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

// ✅ Update user using factory
export const updateUser = updateOne(User);
