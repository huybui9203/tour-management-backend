const express = require("express");
const resController = require("../controllers/resController");
const router = express.Router();

router.get("/", resController.getAll);

module.exports = router;
