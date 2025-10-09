const express = require('express');
const router = express.Router();

const { registerUser, loginUser, updateUserDetails } = require('../controllers/authController');


router.post('/signup', registerUser);

router.post('/signin', loginUser);

router.put('/update', updateUserDetails);

module.exports = router;