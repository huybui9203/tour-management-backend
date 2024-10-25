const express = require('express')
const router = express.Router()
const tourController = require('../../controllers/Admin/tourControllers')
const imageController = require('../../controllers/Admin/imageControllers')
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");

router.get('/tours',adminAuthMiddleware, tourController.getTours)
router.get('/tours/:id',adminAuthMiddleware, tourController.getATour)
router.post('/tours',adminAuthMiddleware, tourController.createTour)
router.put('/tours/:id',adminAuthMiddleware, tourController.updateTour)
router.delete('/tours/:id',adminAuthMiddleware, tourController.deleteTour)
router.post('/tours/:id/dates',adminAuthMiddleware, tourController.createNewDate)
router.get('/tours/:id/dates',adminAuthMiddleware, tourController.getTourDays)
router.delete('/tours/images/:id',adminAuthMiddleware, imageController.deleteTourImage)
router.post('/tours/:id/images',adminAuthMiddleware, imageController.createTourImage)


module.exports = router
