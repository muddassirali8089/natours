import Review from "../models/review.model.js";
import AppError from "../utils/AppError.js";

// ✅ Create a new review
export const createReview = async (req, res, next) => {
  
  const { tourId } = req.params;
  const { review, rating } = req.body;

  if (!review || !rating) {
    return next(new AppError("Review and rating are required", 400));
  }

  const newReview = await Review.create({
    review,
    rating,
    tour: tourId,
    user: req.user.id, // ✅ from auth middleware
  });

  res.status(201).json({
    status: "success",
    data: {
      review: newReview,
    },
  });
};


export const getAllReviews = async (req, res, next) => {
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

// ✅ Get all reviews for a specific tour
export const getTourReviews = async (req, res, next) => {
  const { tourId } = req.params;

  const reviews = await Review.find({ tour: tourId });

  if (!reviews.length) {
    return next(new AppError("No reviews found for this tour", 404));
  }

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews,
    },
  });
};
