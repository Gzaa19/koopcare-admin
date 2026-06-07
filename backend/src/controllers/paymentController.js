import crypto from 'crypto';
import pool from '../config/database.js';
import { snap } from '../config/midtrans.js';
import * as PendingTopupModel from '../models/PendingTopupModel.js';
import * as TransactionModel from '../models/TransactionModel.js';
import * as MemberModel from '../models/MemberModel.js';
import * as notificationModel from '../models/NotificationModel.js';

// POST /mobile/topup  (protected by mobileAuth)
export const createTopup = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const numAmount = parseInt(amount);
    if (!numAmount || numAmount < 10000) {
      return res.status(400).json({ error: 'Nominal minimal Rp10.000' });
    }

    const member = await MemberModel.findById(req.user.id);
    if (!member) return res.status(404).json({ error: 'Anggota tidak ditemukan' });

    const order_id = `TOPUP-${req.user.id}-${Date.now()}`;
    await PendingTopupModel.create({ member_id: req.user.id, order_id, amount: numAmount });

    const transaction = await snap.createTransaction({
      transaction_details: { order_id, gross_amount: numAmount },
      customer_details: {
        first_name: member.full_name,
        phone: member.phone,
      },
    });

    res.status(201).json({
      success: true,
      order_id,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (err) {
    console.error('[Midtrans] createTopup error:', err.message);
    next(err);
  }
};

// POST /payments/midtrans/notification  (PUBLIC — signature is the auth)
export const midtransNotification = async (req, res, next) => {
  try {
    const { order_id, status_code, gross_amount, signature_key, transaction_status } = req.body;

    // 1. Verify signature
    const expected = crypto.createHash('sha512')
      .update(order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY)
      .digest('hex');
    if (expected !== signature_key) {
      console.warn('[Midtrans] Invalid signature for', order_id);
      return res.status(403).json({ error: 'Invalid signature' });
    }

    // 2. Lookup + idempotency
    const topup = await PendingTopupModel.findByOrderId(order_id);
    if (!topup) return res.status(200).json({ ok: true }); // unknown order, ack anyway
    if (topup.status === 'SETTLED') return res.status(200).json({ ok: true }); // already done

    // 3. Branch on status
    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await conn.query('UPDATE pending_topups SET status = "SETTLED" WHERE order_id = ?', [order_id]);
        await conn.query(
          `INSERT INTO transactions (member_id, type, amount, description, reference_id)
           VALUES (?, 'TOP_UP', ?, 'Top up via Midtrans', ?)`,
          [topup.member_id, topup.amount, order_id]
        );
        await conn.query('UPDATE members SET balance = balance + ? WHERE id = ?',
          [topup.amount, topup.member_id]);
        await conn.commit();
      } catch (e) {
        await conn.rollback();
        throw e;
      } finally {
        conn.release();
      }
      await notificationModel.create(topup.member_id, 'Top Up Berhasil',
        `Saldo Anda bertambah Rp${Number(topup.amount).toLocaleString('id-ID')}.`);
    } else if (['deny', 'cancel', 'expire'].includes(transaction_status)) {
      await PendingTopupModel.updateStatus(order_id,
        transaction_status === 'expire' ? 'EXPIRED' : 'FAILED');
    }
    // 'pending' status: leave as-is, wait for next notification

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[Midtrans] notification error:', err.message);
    // Still return 200 — a 500 makes Midtrans retry forever
    res.status(200).json({ ok: false });
  }
};

// GET /mobile/topup/:order_id/status  (protected) — for Flutter polling
export const getTopupStatus = async (req, res, next) => {
  try {
    const topup = await PendingTopupModel.findByOrderId(req.params.order_id);
    if (!topup || topup.member_id !== req.user.id) {
      return res.status(404).json({ error: 'Transaksi tidak ditemukan' });
    }
    res.json({ success: true, status: topup.status });
  } catch (err) { next(err); }
};