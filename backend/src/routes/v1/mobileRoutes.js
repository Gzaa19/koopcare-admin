import { Router } from 'express';
import mobileAuth from '../../middlewares/mobileAuth.js';
import * as mobileController from '../../controllers/mobileController.js';
import { uploadKyc } from '../../config/cloudinary.js';

const router = Router();

// Public (tanpa auth)
router.post('/register', mobileController.registerMember);
router.post('/otp/request', mobileController.requestOtp);
router.post('/otp/verify', mobileController.verifyOtp);
router.post('/login', mobileController.mobileLogin);
router.post('/reset-pin', mobileController.mobileResetPin);

// Protected (perlu auth)
router.use(mobileAuth);
router.get('/profile', mobileController.getProfile);
router.put('/profile', mobileController.updateProfile);

// KYC submit: multipart/form-data dengan field ktp_photo dan selfie_photo
router.post(
    '/kyc/submit',
    uploadKyc.fields([
        { name: 'ktp_photo', maxCount: 1 },
        { name: 'selfie_photo', maxCount: 1 },
    ]),
    mobileController.submitKyc
);

router.get('/kyc/status', mobileController.getKycStatus);
router.get('/loans', mobileController.getMemberLoans);
router.post('/loans/apply', mobileController.applyLoan);
router.get('/loans/:id', mobileController.getLoanDetailMember);
router.get('/transactions', mobileController.getMemberTransactions);
router.get('/notifications', mobileController.getNotifications);
router.patch('/notifications/:id/read', mobileController.markNotificationRead);
router.patch('/notifications/read-all', mobileController.markAllNotificationsRead);

export default router;