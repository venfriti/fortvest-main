import { Router } from 'express';
import { applyForLoan, getMyLoans } from '../controllers/loanController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Protect all routes
router.post('/apply', authenticateToken as any, applyForLoan);
router.get('/my-loans', authenticateToken as any, getMyLoans);

export default router;