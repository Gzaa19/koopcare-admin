import * as inviteCodeService from '../services/inviteCodeService.js';

export const getInviteCodes = async (req, res, next) => {
  try {
    const codes = await inviteCodeService.getInviteCodes();
    res.json({ success: true, data: codes });
  } catch (err) { next(err); }
};

export const createInviteCode = async (req, res, next) => {
  try {
    const { validDays = 30, maxUses = 1 } = req.body;
    const adminId = req.user.id;
    const code = await inviteCodeService.createInviteCode(adminId, validDays, maxUses);
    res.status(201).json({ success: true, data: code });
  } catch (err) { next(err); }
};

export const validateInviteCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const result = await inviteCodeService.validateCode(code);
    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};

export const useInviteCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const record = await inviteCodeService.useInviteCode(code);
    res.json({ success: true, message: 'Kode digunakan', data: record });
  } catch (err) { next(err); }
};