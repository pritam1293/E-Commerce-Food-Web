const express = require('express');
const router = express.Router();

const { registerProduct, getAllProducts, getProductById, updateProductDetails } = require('../controllers/productController');

router.post('/', registerProduct);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.put('/:id', updateProductDetails);

module.exports = router;