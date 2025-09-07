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

// Stats routes
router.get("/stats", getTourStats);
router.get("/monthly-plan/:year", getMonthlyPlan);

// RESTful routes
router.get("/", protect, getAllTours);
router.post("/", createTour);

router.get("/:id", getTour);
router.patch("/:id", updateTour);
router.delete("/:id", protect, restrictTo("admin", "lead-guide"), deleteTour);

export default router;
