const express = require('express');
const router = express.Router();

const {
    registerProduct,
    getAllProducts,
    getProductById,
    updateProductDetails,
    deleteProductById
} = require('../controllers/productController');

const { authenticateToken } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const { moderateLimiter } = require('../middleware/rateLimiter');


router.post('/', authenticateToken, isAdmin, moderateLimiter, registerProduct);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.put('/:id', authenticateToken, isAdmin, moderateLimiter, updateProductDetails);

router.delete('/:id', authenticateToken, isAdmin, moderateLimiter, deleteProductById);

module.exports = router;