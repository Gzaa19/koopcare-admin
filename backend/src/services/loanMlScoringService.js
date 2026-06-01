import axios from 'axios';
import * as MemberModel from '../models/MemberModel.js';

const ML_API_BASE_URL = process.env.ML_API_BASE_URL || 'http://127.0.0.1:8000';
const TIMEOUT = 8000;

function buildPayload(member, loan) {
    let days_birth = -10950;
    if (member.birth_date) {
        const birth = new Date(member.birth_date);
        const today = new Date();
        const diffTime = today - birth;
        days_birth = -Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }
    const amt_annuity = loan.amount / loan.tenor;
    return {
        code_gender: member.code_gender || 'M',
        name_income_type: member.income_type || 'Working',
        name_education_type: member.education || 'Secondary / secondary special',
        name_family_status: member.family_status || 'Married',
        occupation_type: member.occupation || 'Laborers',
        flag_own_car: member.own_car ? 'Y' : 'N',
        flag_own_realty: member.own_realty ? 'Y' : 'N',
        cnt_children: member.children_count || 0,
        cnt_fam_members: member.family_members || 2,
        amt_income_total: member.monthly_income || 1,
        amt_credit: loan.amount,
        amt_annuity: amt_annuity,
        amt_goods_price: loan.amount,
        days_birth: days_birth,
        days_employed: member.employed_days || -1825,
        days_last_phone_change: member.last_phone_change_days || -180,
        ext_source_1: 0.5,
        ext_source_2: 0.5,
        ext_source_3: 0.5
    };
}

export async function scoreLoanApplication(memberId, loanData) {
    const member = await MemberModel.findById(memberId);
    if (!member) throw new Error('Anggota tidak ditemukan');

    const payload = buildPayload(member, loanData);
    console.log('[ML] Sending payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await axios.post(`${ML_API_BASE_URL}/predict`, payload, { timeout: TIMEOUT });
        console.log('[ML] Response:', response.data);

        // Ambil field dari respons ML API
        const prob_default = response.data.prob_default;
        const recommendation = response.data.ai_recommendation; // 'LAYAK' atau 'TIDAK_LAYAK'
        const risk_level = response.data.risk_level || 'MEDIUM';

        if (prob_default === undefined) throw new Error('ML response missing prob_default');

        // ── Skor 3 zona ──────────────────────────────────────────────────
        // ✅ LAYAK            (prob_default < 0.666)  → skor 75 — 100
        // ⚠️  DIPERTIMBANGKAN (0.666 ≤ prob < 0.866) → skor 25 — 74
        // ❌ TIDAK LAYAK      (prob_default ≥ 0.866)  → skor  0 — 24
        const prob_berhasil = 1 - prob_default;
        let ai_score;

        if (prob_default < 0.666) {
            // LAYAK: skor = 50 + (prob_berhasil * 50)
            ai_score = Math.round(50 + prob_berhasil * 50);
        } else if (prob_default < 0.866) {
            // PERLU DIPERTIMBANGKAN: skor = 25 + (prob_berhasil * 25)
            ai_score = Math.round(25 + prob_berhasil * 25);
        } else {
            // TIDAK LAYAK: skor = prob_berhasil * 25
            ai_score = Math.round(prob_berhasil * 25);
        }
        
        return { recommendation, prob_default, ai_score, risk_level };
    } catch (error) {
        console.error('[ML] Error calling ML API:', error.message);
        throw new Error(`ML API failed: ${error.message}`);
    }
}