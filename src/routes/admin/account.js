const express = require('express')
const router = express.Router()
const accountController = require('../../controllers/Admin/accountControllers')

router.get('/accounts', accountController.getAccount)
router.post('/accounts', accountController.createNewAccount)
router.delete('/accounts/:id', accountController.deleteAccount)
router.put('/accounts/:id', accountController.updateAccount)


module.exports = router
