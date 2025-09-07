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
  getToursWithin,
  getDistances,
} from "../controllers/tour.controller.js";

import reviewRouter from "./review.routes.js";
import { protect, restrictTo } from "../controllers/authContrller.js";

const router = express.Router();

router.use("/:tourId/reviews", reviewRouter);

// ⚠️ IMPORTANT: Specific routes MUST come before parameterized routes

// Aliased route
router.get("/top-5-cheap", aliasTopTours, getAllTours);

// Stats routes - BEFORE /:id route
// ✅ Only admins can see tour stats
router.get("/stats", protect, restrictTo("admin"), getTourStats);

// ✅ Admins and lead-guides can see monthly plans
router.get("/monthly-plan/:year", protect, restrictTo("admin", "lead-guide"), getMonthlyPlan);

// 🌍 GEOSPATIAL ROUTES - BEFORE /:id route
// Find tours within radius
router.get(
  "/tours-within/:distance/center/:latlng/unit/:unit",
  getToursWithin
);

// Calculate distances to all tours
router.get("/tours-distances/:latlng/unit/:unit", getDistances);

// GET /api/v1/tours
// ✅ Anyone can read tours
router.get("/", getAllTours);

// POST /api/v1/tours
// ✅ Only guides, lead-guides, and admins can create tours
router.post("/", protect, restrictTo("guide", "lead-guide", "admin"), createTour);

// GET /api/v1/tours/:id - AFTER specific routes
// ✅ Anyone can read a single tour
router.get("/:id", getTour);

// PATCH /api/v1/tours/:id
// ✅ Only lead-guides and admins can update tours
router.patch("/:id", protect, restrictTo("lead-guide", "admin"), updateTour);

// DELETE /api/v1/tours/:id
// ✅ Only admins can delete tours
router.delete("/:id", protect, restrictTo("admin"), deleteTour);

export default router;
