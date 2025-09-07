import Review from "../models/review.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "./catchAsync.js";
import { deleteOne, createOne, updateOne } from "./handlerFactory.js";

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
    req.body.user = req.user.id;

    next(); // Pass to factory function
  }),
  createOne(Review)
];

// ✅ Update review using factory
export const updateReview = updateOne(Review);


export const getAllReviews = async (req, res, next) => {

  console.log("review Route called...");
  
  // If tourId exists (nested route), filter reviews by tour
  const filter = req.params.tourId ? { tour: req.params.tourId } : {};

  const reviews = await Review.find(filter);

  if (!reviews.length) {
    return next(new AppError("No reviews found", 404));
  }

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
};


// ✅ Delete review using factory
export const deleteReview = deleteOne(Review);
// ✅ Get all reviews for a specific tour

