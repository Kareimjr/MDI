const express = require("express");
const router = express.Router();
const { initPayment, verifyPayment } = require("../controllers/paymentController");

router.post("/init", initPayment);
router.get("/verify/:reference", verifyPayment);

module.exports = router;
