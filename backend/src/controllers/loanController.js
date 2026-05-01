// backend/src/controllers/loanController.js
import * as loanService from '../services/loanService.js';

export const getLoans = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || 'PENDING';
    const { data, total } = await loanService.getAllLoans(page, limit, status);
    res.json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    });
  } catch (err) {
    next(err);
  }
};

export const getLoanDetail = async (req, res, next) => {
  try {
    const loan = await loanService.getLoanDetail(req.params.id);
    res.json({ success: true, data: loan });
  } catch (err) {
    next(err);
  }
};

export const approveLoan = async (req, res, next) => {
  try {
    const { approvedAmount, approvedTenor } = req.body;
    if (!approvedAmount || approvedAmount <= 0) throw new Error('Jumlah yang disetujui harus diisi');
    if (!approvedTenor || approvedTenor <= 0) throw new Error('Tenor harus diisi');
    const reviewerId = req.user?.id || 1; // fallback untuk development
    await loanService.approveLoan(req.params.id, reviewerId, approvedAmount, approvedTenor);
    res.json({ success: true, message: 'Pinjaman disetujui' });
  } catch (err) {
    next(err);
  }
};

export const rejectLoan = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) throw new Error('Alasan penolakan harus diisi');
    const reviewerId = req.user?.id || 1;
    await loanService.rejectLoan(req.params.id, reviewerId, reason);
    res.json({ success: true, message: 'Pinjaman ditolak' });
  } catch (err) {
    next(err);
  }
};