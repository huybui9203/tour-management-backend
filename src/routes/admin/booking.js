const express = require('express')
const router = express.Router()
const bookingController = require('../../controllers/Admin/bookingControllers')

router.get('/bookings', bookingController.getBookingCustomer)
router.post('/bookings/:id', bookingController.updateBooking)
router.delete('/bookings/:id', bookingController.deleteBooking)


module.exports = router
