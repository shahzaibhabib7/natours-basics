const express = require('express');
// we can also use destructuring "const {getAllTours, createTours}" etc
const tourController = require('./../controllers/tourController');

// we created a new router and saved it into a new variable
const router = express.Router();

// router.param('id', tourController.checkId);

router.route('/top-5-cheap').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/').get(tourController.getAllTours).post(tourController.createTour);

router.route('/:id').get(tourController.getTour).patch(tourController.updateTour).delete(tourController.deleteTour);


module.exports = router;