const express = require('express');
const router = express.Router();

const { 
    registerUser, 
    loginUser, 
    updateUserDetails, 
    deleteUser 
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { authLimiter, moderateLimiter } = require('../middleware/rateLimiter');


router.post('/signup', authLimiter, registerUser);

router.post('/signin', authLimiter, loginUser);

router.put('/update', authenticateToken, moderateLimiter, updateUserDetails);

router.delete('/delete', authenticateToken, moderateLimiter, deleteUser);

module.exports = router;