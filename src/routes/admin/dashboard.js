const express = require('express')
const router = express.Router()
const dashboardController = require('../../controllers/Admin/dashboardController')

router.get('/dashboard/getMonthlyRevenue2024', dashboardController.getMonthlyRevenue)
router.get('/dashboard/getMostBookedTours', dashboardController.getMostBookedTours)
router.get('/dashboard/getRevenue',dashboardController.getRevenueMonthYear)



module.exports = router
