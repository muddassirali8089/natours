import express from "express";
import {
  createReview,
  getAllReviews,
  getTourReviews,
} from "../controllers/review.controller.js";

import { protect, restrictTo } from "../controllers/authContrller.js";

const router = express.Router({ mergeParams: true }); 
// ✅ mergeParams lets us access tourId from parent route (/tours/:tourId/reviews)

// Routes
router.get("/", getAllReviews);
router.get("/:tourId", getTourReviews);
router.post("/:tourId", protect , restrictTo('user'), createReview);

export default router;
