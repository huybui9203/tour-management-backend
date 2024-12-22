const express = require('express')
const router = express.Router()
const bookingRouter = require('./booking')
const accountRouter = require('./account')
const tourRouter = require('./tour')
const dashboardRouter = require('./dashboard')
const authAdminRouter = require('./auth')


router.use('/', bookingRouter)
router.use('/', accountRouter)
router.use('/', tourRouter)
router.use('/', dashboardRouter)
router.use('/', authAdminRouter)

module.exports = router