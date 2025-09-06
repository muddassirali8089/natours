import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
} from "../controllers/review.controller.js";

import { protect, restrictTo } from "../controllers/authContrller.js";

const router = express.Router({ mergeParams: true });

// GET /api/v1/tours/:tourId/reviews
router.get("/", getAllReviews);

// POST /api/v1/tours/:tourId/reviews
router.post("/", protect, restrictTo("user"), createReview);

router.delete("/:id", protect, restrictTo("user", "admin"), deleteReview);

export default router;
