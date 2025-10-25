const express = require('express');
const router = express.Router();

const { generateOTP, VerifyOTP } = require('../utils/otpService');
const { moderateLimiter } = require('../middleware/rateLimiter');

router.use(moderateLimiter);

router.get('/generate-otp', generateOTP);
router.post('/verify-otp', VerifyOTP);

module.exports = router;