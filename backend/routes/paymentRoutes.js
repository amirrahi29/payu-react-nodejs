const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/paymentController");

router.post("/pay", paymentController.createPayment);

router.post("/payment-success", paymentController.paymentSuccess);

router.post("/payment-failure", paymentController.paymentFailure);

module.exports = router;