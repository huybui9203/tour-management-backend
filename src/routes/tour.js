const express = require("express");
const tourController = require("../controllers/tourController");
const router = express.Router();

router.get("/get-details/:id", tourController.getDetailsTour);
router.get("/get-list", tourController.getListTour);
router.get("/filter-by-type/:type", tourController.filterTourByType);
router.get("/filter-by-field", tourController.filterTourByField);

module.exports = router;
