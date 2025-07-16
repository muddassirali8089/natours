import express from 'express';
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  validateTour
} from '../controllers/tour.controller.js';

const router = express.Router();

// 💡 This middleware will run ONLY when :id is present in the route
router.param('id', checkId);

// Routes
router.get("/", getAllTours);
router.post("/", validateTour,createTour);
router.get("/:id", getTour);
router.patch("/:id", updateTour);
router.delete("/:id", deleteTour);

export default router;
