import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

async function main() {
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    console.log('Connected to DB:', process.env.DATABASE_URL);
    const [rows] = await conn.query('SELECT * FROM kyc_submissions WHERE member_id = ? ORDER BY created_at DESC', [7]);
    console.log('KYC submissions for member_id=7:');
    console.table(rows);
    await conn.end();
  } catch (err) {
    console.error('DB error:', err.message);
    process.exit(1);
  }
}

main();
