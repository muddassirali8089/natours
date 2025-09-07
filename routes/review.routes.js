import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
} from "../controllers/review.controller.js";

import { protect, restrictTo, checkReviewOwnership, checkReviewUpdateOwnership } from "../controllers/authContrller.js";

const router = express.Router({ mergeParams: true });

// GET /api/v1/tours/:tourId/reviews
// ✅ Anyone can read reviews
router.get("/", getAllReviews);

// GET /api/v1/tours/:tourId/reviews/:id
// ✅ Anyone can read a single review
router.get("/:id", getReview);

// POST /api/v1/tours/:tourId/reviews
// ✅ Only users can create reviews
router.post("/", protect, restrictTo("user"), createReview);

// PATCH /api/v1/tours/:tourId/reviews/:id
// ✅ Users can update own reviews, admin can update any
router.patch("/:id", protect, checkReviewUpdateOwnership, updateReview);

// DELETE /api/v1/tours/:tourId/reviews/:id  
// ✅ Users can delete own reviews, admin can delete any
router.delete("/:id", protect, checkReviewOwnership, deleteReview);

export default router;
