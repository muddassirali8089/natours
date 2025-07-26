import express from 'express';
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats
} from '../controllers/tour.controller.js';

const router = express.Router();

// Custom route for top 5 cheap tours
router.get('/top-5-cheap', aliasTopTours, getAllTours);

// Aggregation stats route
router.get('/tour-stats', getTourStats);

// RESTful routes
router.get("/", getAllTours);
router.post("/", createTour);
router.get("/:id", getTour);
router.patch("/:id", updateTour);
router.delete("/:id", deleteTour);

export default router;
