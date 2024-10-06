const express = require('express')
const router = express.Router()
const bookingRouter = require('./booking')

router.use('/', bookingRouter)

module.exports = router