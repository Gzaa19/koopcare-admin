const mysql = require('mysql2');
require('dotenv').config();

// Membuat connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'koopcare_user',
  password: process.env.DB_PASSWORD || 'koopcarepassword',
  database: process.env.DB_NAME || 'koopcare_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ubah pool menjadi Promise agar bisa pakai async/await
const promisePool = pool.promise();

module.exports = promisePool;