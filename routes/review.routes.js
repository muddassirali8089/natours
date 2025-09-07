import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from "../controllers/review.controller.js";

import { protect, restrictTo } from "../controllers/authContrller.js";

const router = express.Router({ mergeParams: true });

// GET /api/v1/tours/:tourId/reviews
router.get("/", getAllReviews);

// POST /api/v1/tours/:tourId/reviews
router.post("/", protect, restrictTo("user"), createReview);

// PATCH /api/v1/tours/:tourId/reviews/:id
router.patch("/:id", protect, restrictTo("admin"), updateReview);

// DELETE /api/v1/tours/:tourId/reviews/:id
router.delete("/:id", protect, deleteReview);

export default router;
