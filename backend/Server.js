const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 5000;

// Middleware for JSON
app.use(express.json());
// Middleware for CORS
app.use(cors());

// Example route
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


app.post('/pizza', (req, res) => {
  const { name, size } = req.body;
  res.json({ message: `Order received for ${size} ${name} pizza!` });
});
