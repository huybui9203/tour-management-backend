const express = require('express')
const router = express.Router()
const bookingRouter = require('./booking')
const accountRouter = require('./account')
const tourRouter = require('./tour')
const dashboardRouter = require('./dashboard')

router.use('/', bookingRouter)
router.use('/', accountRouter)
router.use('/', tourRouter)
router.use('/', dashboardRouter)

module.exports = router