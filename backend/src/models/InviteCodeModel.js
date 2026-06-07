import pool from '../config/database.js';

export const findAll = async (limit = 50, offset = 0) => {
    const [rows] = await pool.query(`
        SELECT ic.*, m.full_name as creator_name
        FROM invite_codes ic
        LEFT JOIN members m ON ic.created_by = m.id
        ORDER BY ic.created_at DESC
        LIMIT ? OFFSET ?
    `, [limit, offset]);
    const [countRows] = await pool.query('SELECT COUNT(*) as total FROM invite_codes');
    return { data: rows, total: countRows[0].total };
};

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM invite_codes WHERE id = ?', [id]);
    return rows[0];
};

export const create = async (code, createdBy, validUntil, maxUses = 1) => {
    const [result] = await pool.query(
        'INSERT INTO invite_codes (code, created_by, valid_until, max_uses) VALUES (?, ?, ?, ?)',
        [code, createdBy, validUntil, maxUses]
    );
    return result.insertId;
};

export const updateStatus = async (id, status) => {
    await pool.query('UPDATE invite_codes SET status = ? WHERE id = ?', [status, id]);
};

export const updateValidity = async (id, validUntil) => {
    await pool.query('UPDATE invite_codes SET valid_until = ? WHERE id = ?', [validUntil, id]);
};

export const revoke = async (id) => {
    await pool.query('UPDATE invite_codes SET status = "expired" WHERE id = ?', [id]);
};

export const findByCode = async (code) => {
    const [rows] = await pool.query('SELECT * FROM invite_codes WHERE code = ?', [code]);
    return rows[0];
};

export const deactivateExpired = async () => {
    await pool.query(
        'UPDATE invite_codes SET status = "expired" WHERE valid_until < NOW() AND status = "active"'
    );
};

export const incrementUsed = async (id) => {
    await pool.query(
        'UPDATE invite_codes SET used_count = used_count + 1 WHERE id = ?',
        [id]
    );
};