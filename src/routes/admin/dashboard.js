const express = require('express')
const router = express.Router()
const dashboardController = require('../../controllers/Admin/dashboardController')
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");

router.get('/dashboard/getMonthlyRevenue2024',adminAuthMiddleware, dashboardController.getMonthlyRevenue)
router.get('/dashboard/getMostBookedTours',adminAuthMiddleware, dashboardController.getMostBookedTours)
router.get('/dashboard/getRevenue',adminAuthMiddleware,dashboardController.getRevenueMonthYear)
router.get('/dashboard/profile',adminAuthMiddleware,dashboardController.getProfile)



module.exports = router
