import jwt from 'jsonwebtoken';
import * as MemberModel from '../models/MemberModel.js';
import { verifyPin, hashPin, generateRandomPin } from '../services/pinService.js';
import * as inviteCodeService from '../services/inviteCodeService.js';
import { normalizePhone, normalizeIdentifier, validatePhone } from '../utils/validators.js';

// Simpan OTP sementara (dalam production gunakan Redis atau database)
const otpStore = new Map();

export const registerAdmin = async (req, res, next) => {
  try {
    const { inviteCode, fullName, nik, phone, email, pin } = req.body;

    // Validasi kehadiran
    if (!inviteCode) return res.status(400).json({ error: 'Kode undangan wajib diisi' });
    if (!fullName) return res.status(400).json({ error: 'Nama lengkap wajib diisi' });
    if (!nik) return res.status(400).json({ error: 'NIK wajib diisi' });
    if (!phone) return res.status(400).json({ error: 'Nomor WhatsApp wajib diisi' });
    if (!pin) return res.status(400).json({ error: 'PIN wajib diisi' });

    // Format NIK, PIN, dan Phone
    if (!/^\d{16}$/.test(nik)) return res.status(400).json({ error: 'NIK harus 16 digit angka' });
    if (!/^\d{6}$/.test(pin)) return res.status(400).json({ error: 'PIN harus 6 digit angka' });
    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Nomor WhatsApp tidak valid (format yang didukung: 08xx, 628xx, atau +628xx)' });
    }

    const normalizedPhone = normalizePhone(phone);

    // Cek kode undangan
    const { valid, record, message } = await inviteCodeService.validateCode(inviteCode);
    if (!valid) return res.status(400).json({ error: message });

    // Cek duplikasi NIK
    const existing = await MemberModel.findByNIK(nik);
    if (existing) return res.status(400).json({ error: 'NIK sudah terdaftar' });

    // Hash PIN
    const hashedPin = await hashPin(pin);

    // Simpan member dengan role 'admin'
    const memberId = await MemberModel.createMember({
      fullName,
      nik,
      phone: normalizedPhone,
      email: email || null,
      pin: hashedPin,
      status: 'ACTIVE',
      role: 'admin',
    });

    // Gunakan kode undangan (increment used_count)
    await inviteCodeService.useInviteCode(inviteCode);

    // Generate token
    const token = jwt.sign(
      { id: memberId, role: 'admin', name: fullName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin berhasil didaftarkan',
      token,
      user: {
        id: memberId,
        name: fullName,
        email: email || null,
        phone: normalizedPhone,
        role: 'admin',
        status: 'ACTIVE',
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { identifier, pin } = req.body;
    if (!identifier || !pin) {
      return res.status(400).json({ error: 'Identifier dan PIN wajib diisi' });
    }

    const normalizedIdentifier = normalizeIdentifier(identifier);

    // Cari member berdasarkan email atau phone
    let member = await MemberModel.findByEmail(normalizedIdentifier);
    if (!member) member = await MemberModel.findByPhone(normalizedIdentifier);
    if (!member) return res.status(401).json({ error: 'Akun tidak ditemukan' });

    const isValid = await verifyPin(pin, member.pin);
    if (!isValid) return res.status(401).json({ error: 'PIN salah' });

    // Hanya admin yang bisa login ke web admin
    if (member.role !== 'admin') {
      return res.status(403).json({ error: 'Hanya admin yang bisa login' });
    }

    const token = jwt.sign(
      { id: member.id, role: member.role, name: member.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: member.id,
        name: member.full_name,
        email: member.email,
        phone: member.phone,
        role: member.role,
        status: member.status,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPin = async (req, res, next) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ error: 'Nomor WhatsApp atau email wajib diisi' });
    }

    const normalizedIdentifier = normalizeIdentifier(identifier);
    let member = await MemberModel.findByEmail(normalizedIdentifier);
    if (!member) member = await MemberModel.findByPhone(normalizedIdentifier);
    if (!member) return res.status(404).json({ error: 'Akun tidak ditemukan' });

    // Hanya admin yang bisa meminta reset PIN melalui web
    if (member.role !== 'admin') {
      return res.status(403).json({ error: 'Fitur ini hanya untuk admin' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 menit
    otpStore.set(normalizedIdentifier, { otp, expiresAt });

    // Simulasi kirim OTP (tampilkan di console)
    console.log(`[OTP] untuk ${normalizedIdentifier}: ${otp}`);

    res.json({ success: true, message: 'Kode OTP telah dikirim ke WhatsApp/email terdaftar' });
  } catch (err) {
    next(err);
  }
};

export const resetPin = async (req, res, next) => {
  try {
    const { identifier, otp, newPin } = req.body;
    if (!identifier || !otp || !newPin) {
      return res.status(400).json({ error: 'Identifier, OTP, dan PIN baru wajib diisi' });
    }
    if (!/^\d{6}$/.test(newPin)) {
      return res.status(400).json({ error: 'PIN baru harus 6 digit angka' });
    }

    const normalizedIdentifier = normalizeIdentifier(identifier);
    const stored = otpStore.get(normalizedIdentifier);
    if (!stored || stored.otp !== otp || stored.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'OTP tidak valid atau sudah kadaluarsa' });
    }

    let member = await MemberModel.findByEmail(normalizedIdentifier);
    if (!member) member = await MemberModel.findByPhone(normalizedIdentifier);
    if (!member) return res.status(404).json({ error: 'Akun tidak ditemukan' });

    const hashedPin = await hashPin(newPin);
    await MemberModel.updatePin(member.id, hashedPin);

    otpStore.delete(normalizedIdentifier);
    res.json({ success: true, message: 'PIN berhasil direset. Silakan login dengan PIN baru.' });
  } catch (err) {
    next(err);
  }
};