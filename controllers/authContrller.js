
import User from '../models/user.model.js'; // adjust path as needed
import catchAsync from '../controllers/catchAsync.js';

import { signToken } from '../utils/jwt.js';


export const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({ name, email, password, confirmPassword });


  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});
