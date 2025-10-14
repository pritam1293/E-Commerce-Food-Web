const express = require('express');
const router = express.Router();

const { 
    getAllUsers, 
    getUserById, 
    getMyOrderHistory, 
    getUserOrderHistory, 
    getUserOrderByOrderId 
} = require('../controllers/userController');

const { authenticateToken } = require('../middleware/authMiddleware');

const { isAdmin } = require('../middleware/roleMiddleware');

router.get('/', authenticateToken, isAdmin, getAllUsers);

router.get('/my-orders', authenticateToken, getMyOrderHistory);

router.get('/order', authenticateToken, isAdmin, getUserOrderByOrderId);

router.get('/:id', authenticateToken, isAdmin, getUserById);

router.get('/:id/order-history', authenticateToken, isAdmin, getUserOrderHistory);

module.exports = router;
