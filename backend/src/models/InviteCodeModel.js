import pool from '../config/database.js';

export const create = async (code, createdBy, validUntil, maxUses = 1) => {
  const [result] = await pool.query(
    'INSERT INTO invite_codes (code, created_by, valid_until, max_uses) VALUES (?, ?, ?, ?)',
    [code, createdBy, validUntil, maxUses]
  );
  return result.insertId;
};

export const findAll = async () => {
  const [rows] = await pool.query(`
    SELECT ic.*, m.full_name as creator_name
    FROM invite_codes ic
    LEFT JOIN members m ON ic.created_by = m.id
    ORDER BY ic.created_at DESC
  `);
  return rows;
};

export const findByCode = async (code) => {
  const [rows] = await pool.query('SELECT * FROM invite_codes WHERE code = ?', [code]);
  return rows[0];
};

export const incrementUsed = async (id) => {
  await pool.query('UPDATE invite_codes SET used_count = used_count + 1 WHERE id = ?', [id]);
};

export const deactivateExpired = async () => {
  await pool.query('UPDATE invite_codes SET status = "expired" WHERE valid_until < CURDATE() AND status = "active"');
};