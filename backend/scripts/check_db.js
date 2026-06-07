import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

async function main() {
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('Connected to DB:', process.env.DATABASE_URL);
    const [rows] = await conn.query('SELECT id, full_name, nik, phone, email, created_at FROM members ORDER BY created_at DESC LIMIT 20');
    console.log('Recent members:');
    console.table(rows);
    await conn.end();
  } catch (err) {
    console.error('DB error:', err.message);
    process.exit(1);
  }
}

main();
