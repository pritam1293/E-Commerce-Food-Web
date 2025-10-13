const express = require('express');
const router = express.Router();

const { placeOrder, updateOrderStatus } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.post('/place-order', authenticateToken, placeOrder);

router.put('/update-order-status', authenticateToken, isAdmin, updateOrderStatus);

router.get('/:orderId', (req, res) => {
  // Fetch order details logic here
  res.send(`Order details for order ID: ${req.params.orderId}`);
});

module.exports = router;