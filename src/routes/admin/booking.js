const express = require('express')
const router = express.Router()
const bookingController = require('../../controllers/Admin/bookingControllers')
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");


router.get('/bookings',adminAuthMiddleware, bookingController.getBookingCustomer)
router.post('/bookings/:id',adminAuthMiddleware, bookingController.updateBooking)
router.delete('/bookings/:id',adminAuthMiddleware, bookingController.deleteBooking)
router.get('/bookings/:id', adminAuthMiddleware,bookingController.getABooking)


module.exports = router
