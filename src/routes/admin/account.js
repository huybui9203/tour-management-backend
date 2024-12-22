const express = require('express')
const router = express.Router()
const accountController = require('../../controllers/Admin/accountControllers')
const adminAuthMiddleware = require("../../middlewares/adminAuthMiddleware");


router.get('/accounts',adminAuthMiddleware, accountController.getAccount)
router.post('/accounts',adminAuthMiddleware, accountController.createNewAccount)
router.delete('/accounts/:id',adminAuthMiddleware, accountController.deleteAccount)
router.put('/accounts/:id',adminAuthMiddleware, accountController.updateAccount)



module.exports = router
