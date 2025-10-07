const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const app = express();

const PORT = 5000;

// Middleware for JSON
app.use(express.json());
// Middleware for CORS
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
