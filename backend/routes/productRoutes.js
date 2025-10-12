const express = require('express');
const router = express.Router();

const { 
    registerProduct, 
    getAllProducts, 
    getProductById, 
    updateProductDetails, 
    deleteProductById 
} = require('../controllers/productController');

const { authenticateToken} = require('../middleware/authMiddleware');
const {isAdmin} = require('../middleware/roleMiddleware');


router.post('/', authenticateToken, isAdmin, registerProduct);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.put('/:id', authenticateToken, isAdmin, updateProductDetails);

router.delete('/:id', authenticateToken, isAdmin, deleteProductById);

module.exports = router;