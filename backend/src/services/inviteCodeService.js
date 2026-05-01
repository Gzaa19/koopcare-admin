import * as inviteCodeModel from '../models/InviteCodeModel.js';
import { generateRandomCode } from '../utils/helpers.js';

export const createInviteCode = async (adminId, validDays = 30, maxUses = 1) => {
  const code = generateRandomCode(10);
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + validDays);
  const id = await inviteCodeModel.create(code, adminId, validUntil, maxUses);
  return { id, code, validUntil, maxUses };
};

export const getInviteCodes = async () => {
  return await inviteCodeModel.findAll();
};

export const validateCode = async (code) => {
  await inviteCodeModel.deactivateExpired();
  const record = await inviteCodeModel.findByCode(code);
  if (!record) return { valid: false, message: 'Kode tidak ditemukan' };
  if (record.status !== 'active') return { valid: false, message: 'Kode tidak aktif' };
  if (record.used_count >= record.max_uses) return { valid: false, message: 'Kode sudah habis dipakai' };
  return { valid: true, record };
};

export const useInviteCode = async (code) => {
  const { valid, record, message } = await validateCode(code);
  if (!valid) throw new Error(message);
  await inviteCodeModel.incrementUsed(record.id);
  return record;
};