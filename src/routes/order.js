const express = require("express");
const orderController = require("../controllers/orderController");
const verifyUser = require("../middlewares/verifyUser");
const router = express.Router();

router.post("/create-order/:idTour", verifyUser, orderController.createNewOrder);
router.get("/get-history", verifyUser, orderController.getHistory);
router.post("/pay-vnpay/:id", verifyUser, orderController.paymentWithVNPay);
router.get("/vnpay_return/:id", orderController.returnVnPay);

module.exports = router;
