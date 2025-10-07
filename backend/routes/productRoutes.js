const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // Fetch all products logic here
  res.send('List of all products');
});

router.get('/:productId', (req, res) => {
  // Fetch product details logic here
  res.send(`Product details for product ID: ${req.params.productId}`);
});

module.exports = router;