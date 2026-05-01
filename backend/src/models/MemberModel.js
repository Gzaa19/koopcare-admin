// backend/src/models/MemberModel.js
import pool from '../config/database.js';

export const findAll = async (limit, offset, search = '', role = null) => {
  let query = 'SELECT id, full_name, nik, phone, status, balance, role, created_at FROM members';
  const params = [];
  const conditions = [];

  if (search) {
    conditions.push('(full_name LIKE ? OR nik LIKE ? OR phone LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (role && role !== 'ALL') {
    conditions.push('role = ?');
    params.push(role);
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);
  const [rows] = await pool.query(query, params);

  // Hitung total dengan filter yang sama
  let countQuery = 'SELECT COUNT(*) as total FROM members';
  if (conditions.length) {
    countQuery += ' WHERE ' + conditions.join(' AND ');
  }
  const [countRows] = await pool.query(countQuery, params.slice(0, -2)); // hapus limit & offset
  return { data: rows, total: countRows[0].total };
};


export const findById = async (id) => {
  const [rows] = await pool.query('SELECT id, full_name, nik, phone, status, balance FROM members WHERE id = ?', [id]);
  return rows[0];
};

export const updatePin = async (id, hashedPin) => {
  await pool.query('UPDATE members SET pin = ? WHERE id = ?', [hashedPin, id]);
};

export const updateStatus = async (id, status) => {
  await pool.query('UPDATE members SET status = ? WHERE id = ?', [status, id]);
};

export const countByStatus = async (status) => {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM members WHERE status = ?', [status]);
  return rows[0].count;
};

export const findByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM members WHERE email = ?', [email]);
  return rows[0];
};

export const findByPhone = async (phone) => {
  const [rows] = await pool.query('SELECT * FROM members WHERE phone = ?', [phone]);
  return rows[0];
};

export const findByNIK = async (nik) => {
  const [rows] = await pool.query('SELECT * FROM members WHERE nik = ?', [nik]);
  return rows[0];
};

export const createMember = async (memberData) => {
  const { fullName, nik, phone, email, pin, status, role } = memberData;
  const [result] = await pool.query(
    'INSERT INTO members (full_name, nik, phone, email, pin, status, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [fullName, nik, phone, email, pin, status, role || 'member']
  );
  return result.insertId;
};

