/**
 * Dummy AI Scoring Service
 * Menghitung skor kelayakan pinjaman berdasarkan data anggota.
 * Skor 0-100, makin tinggi makin layak.
 */
export const calculateScore = (memberData) => {
  // memberData: { tenureMonths, monthlyIncome, existingLoanBalance, hasCollateral }
  let score = 50; // base
  
  if (memberData.tenureMonths >= 12) score += 20;
  else if (memberData.tenureMonths >= 6) score += 10;
  
  if (memberData.monthlyIncome > 5000000) score += 15;
  else if (memberData.monthlyIncome > 2000000) score += 5;
  
  if (memberData.existingLoanBalance === 0) score += 10;
  
  if (memberData.hasCollateral) score += 5;
  
  return Math.min(100, Math.max(0, score));
};

export const getMaxApprovalAmount = (score, requestedAmount, monthlyIncome) => {
  if (score < 60) return 0;
  if (score >= 80) return requestedAmount;
  // antara 60-79, maksimal 50% dari pendapatan bulanan * 12
  const maxBasedOnIncome = monthlyIncome * 12 * 0.5;
  return Math.min(requestedAmount, maxBasedOnIncome);
};