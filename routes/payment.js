// backend/routes/payment.js
const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controller/payment');

router.post('/create-checkout-session', createPaymentIntent);

module.exports = router;
