const express = require("express");
const orderController = require("../controllers/orderController");
const verifyUser = require("../middlewares/verifyUser");
const router = express.Router();

router.post("/create-order", verifyUser, orderController.createNewOrder);

module.exports = router;
