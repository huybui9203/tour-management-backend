const express = require('express')
const router = express.Router()
const tourController = require('../../controllers/Admin/tourControllers')

router.get('/tours', tourController.getTours)
router.get('/tours/:id', tourController.getATour)
// router.post('/tours', tourController.createNewAccount)
// router.delete('/tours/:id', tourController.deleteAccount)
// router.put('/tours/:id', tourController.updateAccount)


module.exports = router
