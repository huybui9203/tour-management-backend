const express = require('express')
const router = express.Router()
const authController = require('../../controllers/Admin/authController')

router.post('/auth/login', authController.login)
router.delete('/auth/logout', authController.logout)


module.exports = router
