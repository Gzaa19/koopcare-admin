import axios from 'axios';

const WHATSAPP_API_URL = 'https://api.fonnte.com/send';

export async function sendOTP(phoneNumber, otp) {
    // Baca env saat fungsi dipanggil agar Railway env vars terbaca dengan benar
    const useDummy = process.env.USE_DUMMY_OTP === 'true';
    const dummyCode = process.env.DUMMY_OTP_CODE || '123456';
    const apiKey = process.env.WHATSAPP_API_KEY;

    // Mode DUMMY — untuk development / capstone
    if (useDummy) {
        console.log(`[OTP] Mode DUMMY aktif. Kode untuk ${phoneNumber}: ${dummyCode}`);
        return true;
    }

    // Mode NYATA — butuh WHATSAPP_API_KEY
    if (!apiKey) {
        console.error('[WhatsApp] WHATSAPP_API_KEY tidak dikonfigurasi.');
        throw new Error('WhatsApp API key tidak dikonfigurasi');
    }

    const target = phoneNumber.replace(/^\+/, '');
    const message = `Kode verifikasi KoopCare Anda adalah: ${otp}\n\nKode ini berlaku 10 menit. Jangan berikan ke siapa pun.`;

    try {
        const response = await axios.post(WHATSAPP_API_URL, {
            target,
            message,
            delay: '2',
            countryCode: '62'
        }, {
            headers: { 'Authorization': apiKey }
        });
        console.log(`[WhatsApp] OTP terkirim ke ${phoneNumber}:`, response.data);
        return true;
    } catch (error) {
        console.error('[WhatsApp] Gagal mengirim:', error.response?.data || error.message);
        return false;
    }
}
