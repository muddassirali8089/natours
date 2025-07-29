import express from 'express';
import {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getGeneralTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances
} from '../controllers/tour.controller.js';

const router = express.Router();

// Aliasing route for top 5 cheap tours
router.route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);

// Stats routes
router.route('/stats')
  .get(getTourStats); // Detailed stats by difficulty

router.route('/general-stats')
  .get(getGeneralTourStats); // General overview stats

router.route('/monthly-plan/:year')
  .get(getMonthlyPlan); // Monthly stats for a given year

// Geo-spatial routes
router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin); // Get tours within a certain distance

router.route('/distances/:latlng/unit/:unit')
  .get(getDistances); // Get distances to all tours from a point

// RESTful routes
router.route('/')
  .get(getAllTours)
  .post(createTour);

router.route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

export default router;