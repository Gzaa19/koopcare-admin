const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Agar bisa menerima format JSON di request body
app.use(express.urlencoded({ extended: true }));

// Test Route & Database Connection
app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS solution');
    res.status(200).json({
      status: 'success',
      message: 'KoopCare API is running smoothly!',
      database: 'Connected to MySQL successfully.'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Menjalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});