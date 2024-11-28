const express = require("express");
const tourController = require("../controllers/tourController");
const verifyUser = require("../middlewares/verifyUser");
const router = express.Router();

router.get("/get-details/:id", tourController.getDetailsTour);
router.get("/get-list", tourController.getListTour);
router.get("/filter-by-type/:type", tourController.filterTourByType);
router.get("/filter-by-field", tourController.filterTourByField);
router.post('/:id/like',verifyUser, tourController.likeTour)
router.delete('/:id/unLike',verifyUser, tourController.unLikeTour)
router.get('/new', tourController.getNewTours)
router.get('/discount', tourController.getDiscountingTours)
module.exports = router;
