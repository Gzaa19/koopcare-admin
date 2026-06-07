export const validateNIK = (nik) => {
  if (!nik) return false;
  const nikStr = nik.toString();
  return /^\d{16}$/.test(nikStr);
};

export const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneStr = phone.toString().trim();
  // Format: +62xxxxxxxx, 62xxxxxxxx, atau 08xxxxxxxx
  return /^(\+62|62|0)[0-9]{9,13}$/.test(phoneStr);
};

export const normalizePhone = (phone) => {
  if (!phone) return '';
  let phoneStr = phone.toString().trim();
  
  // Hapus semua karakter non-angka kecuali +
  phoneStr = phoneStr.replace(/[^0-9+]/g, '');

  if (phoneStr.startsWith('+62')) {
    return phoneStr;
  }
  if (phoneStr.startsWith('62')) {
    return '+' + phoneStr;
  }
  if (phoneStr.startsWith('0')) {
    return '+62' + phoneStr.slice(1);
  }
  
  return phoneStr;
};

export const normalizeIdentifier = (identifier) => {
  if (!identifier) return '';
  const trimmed = identifier.toString().trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  return normalizePhone(trimmed);
};

export const validateNominal = (amount) => {
  const num = Number(amount);
  return !isNaN(num) && num > 0 && Number.isInteger(num);
};

export const validatePin = (pin) => {
  if (!pin) return false;
  const pinStr = pin.toString();
  return /^\d{6}$/.test(pinStr);
};

export const validateEmail = (email) => {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};