require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generalLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const otpRoutes = require('./routes/otpRoutes');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware for JSON
app.use(express.json());
// Middleware for CORS
app.use(cors());

// Apply general rate limiter to all routes
app.use(generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
