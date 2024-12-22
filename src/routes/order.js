const express = require("express");
const orderController = require("../controllers/orderController");
const verifyUser = require("../middlewares/verifyUser");
const router = express.Router();

router.post("/create-order/:idTour", verifyUser, orderController.createNewOrder);
router.get("/get-history",verifyUser, orderController.getHistory);
router.post("/pay-vnpay/:id", verifyUser, orderController.paymentWithVNPay);
router.post("/vnpay/refund",verifyUser ,orderController.vnpayRefund);
router.get("/vnpay_return/:id",verifyUser, orderController.returnVnPay);
router.delete('/:id/cancel', verifyUser, orderController.cancelBooking)
router.delete('/:id/auto-cancel', verifyUser, orderController.destroyBooking)

module.exports = router;
