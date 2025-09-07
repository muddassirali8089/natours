import Review from "../models/review.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "./catchAsync.js";
import { deleteOne, createOne, updateOne, getAll, getOne } from "./handlerFactory.js";

// ✅ Create a new review using factory
export const createReview = [
  catchAsync(async (req, res, next) => {
    const { tourId } = req.params;
    const { review, rating } = req.body;

    if (!review || !rating) {
      return next(new AppError("Review and rating are required", 400));
    }

    // Set tour and user from params and auth middleware
    req.body.tour = tourId;
    req.body.user = req.user.id || req.user._id;

    // 🔍 Debug: Log what we're storing
    console.log("🔍 Creating review with:");
    console.log("Tour ID:", req.body.tour);
    console.log("User ID:", req.body.user);
    console.log("req.user.id:", req.user.id);
    console.log("req.user._id:", req.user._id);

    next(); // Pass to factory function
  }),
  createOne(Review)
];

// ✅ Get all reviews using factory
export const getAllReviews = getAll(Review);

// ✅ Get single review using factory  
export const getReview = getOne(Review, { path: 'user', select: 'name photo' });

// ✅ Update review using factory
export const updateReview = updateOne(Review);

// ✅ Delete review using factory
export const deleteReview = deleteOne(Review);

