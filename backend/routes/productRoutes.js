const express = require('express');
const router = express.Router();

const { registerProduct, getAllProducts, getProductById, updateProductDetails, deleteProductById } = require('../controllers/productController');

router.post('/', registerProduct);

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.put('/:id', updateProductDetails);

router.delete('/:id', deleteProductById);

module.exports = router;