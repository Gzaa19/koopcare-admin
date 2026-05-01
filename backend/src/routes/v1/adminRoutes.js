import { Router } from 'express';
import { getInviteCodes, createInviteCode } from '../../controllers/inviteCodeController.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import { adminOnly } from '../../middlewares/roleMiddleware.js';

const router = Router();
router.use(authMiddleware, adminOnly);
router.get('/invite-codes', getInviteCodes);
router.post('/invite-codes', createInviteCode);
export default router;