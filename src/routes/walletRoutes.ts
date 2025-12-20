import { Router } from 'express';
import { fundWallet, getBalance } from '../controllers/walletController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// All wallet routes must be protected
router.post('/fund', authenticateToken as any, fundWallet);
router.get('/balance', authenticateToken as any, getBalance);

export default router;