import express from "express";
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from "../controllers/tour.controller.js";

import reviewRouter from "./review.routes.js";
import { protect, restrictTo } from "../controllers/authContrller.js";

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

// Aliased route
router.get("/top-5-cheap", aliasTopTours, getAllTours);

// GET /api/v1/tours
// ✅ Anyone can read tours
router.get("/", getAllTours);

// GET /api/v1/tours/:id
// ✅ Anyone can read a single tour
router.get("/:id", getTour);

// POST /api/v1/tours
// ✅ Only guides, lead-guides, and admins can create tours
router.post("/", protect, restrictTo("guide", "lead-guide", "admin"), createTour);

// PATCH /api/v1/tours/:id
// ✅ Only lead-guides and admins can update tours
router.patch("/:id", protect, restrictTo("lead-guide", "admin"), updateTour);

// DELETE /api/v1/tours/:id
// ✅ Only admins can delete tours
router.delete("/:id", protect, restrictTo("admin"), deleteTour);

// Stats routes
// ✅ Only admins can see tour stats
router.get("/stats", protect, restrictTo("admin"), getTourStats);

// ✅ Admins and lead-guides can see monthly plans
router.get("/monthly-plan/:year", protect, restrictTo("admin", "lead-guide"), getMonthlyPlan);

export default router;
