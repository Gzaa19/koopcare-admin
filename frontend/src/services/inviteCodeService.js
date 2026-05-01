import api from './api.js';

export const fetchInviteCodes = async () => {
  const res = await api.get('/admin/invite-codes');
  return res.data;
};

export const createInviteCode = async (validDays = 30, maxUses = 1) => {
  const res = await api.post('/admin/invite-codes', { validDays, maxUses });
  return res.data;
};