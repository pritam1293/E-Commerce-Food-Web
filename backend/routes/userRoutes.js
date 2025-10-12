const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, isAdmin, getAllUsers);
router.get('/:id', authenticateToken, isAdmin, getUserById);

module.exports = router;
