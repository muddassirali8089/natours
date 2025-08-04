
import User from '../models/user.model.js'; // adjust path as needed
import catchAsync from '../controllers/catchAsync.js';
export const createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});