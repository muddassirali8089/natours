import express from 'express';
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
 
} from '../controllers/tour.controller.js';

const router = express.Router();

// Aliasing route for top 5 cheap tours
router.route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);

// Stats routes
router.route('/stats')
  .get(getTourStats); // Detailed stats by difficulty


router.route('/monthly-plan/:year')
  .get(getMonthlyPlan); // Monthly stats for a given year



// RESTful routes
router.route('/')
  .get(getAllTours)
  .post(createTour);

router.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

export default router;