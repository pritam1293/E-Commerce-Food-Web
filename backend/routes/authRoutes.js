const express = require('express');
const router = express.Router();

const { registerUser, loginUser, updateUserDetails, deleteUser } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');


router.post('/signup', registerUser);

router.post('/signin', loginUser);

router.put('/update', authenticateToken, updateUserDetails);

router.delete('/delete', authenticateToken, deleteUser);

module.exports = router;