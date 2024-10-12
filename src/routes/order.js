const express = require("express");
const orderController = require("../controllers/orderController");
const verifyUser = require("../middlewares/verifyUser");
const router = express.Router();

router.post("/create-order/:idTour", verifyUser, orderController.createNewOrder);
router.get("/get-history", verifyUser, orderController.getHistory);

module.exports = router;
