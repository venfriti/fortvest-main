import { Router } from 'express';
import { applyForLoan, getMyLoans, repayLoan } from '../controllers/loanController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Protect all routes
router.post('/apply', authenticateToken as any, applyForLoan);
router.get('/my-loans', authenticateToken as any, getMyLoans);
router.post('/:id/repay', authenticateToken as any, repayLoan);

export default router;