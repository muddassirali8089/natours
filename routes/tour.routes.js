import express from 'express';
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour
} from '../controllers/tour.controller.js';

const router = express.Router();

router.get("/" , getAllTours);
router.post("/" , createTour);
router.get("/:id" , getTour);
router.patch("/:id" , updateTour);
router.delete("/:id" , deleteTour);

export default router;
