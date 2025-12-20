import { Router } from 'express';
import { createSavingsPlan, getMySavings, topUpSavings } from '../controllers/savingsController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', authenticateToken as any, createSavingsPlan);
router.get('/', authenticateToken as any, getMySavings);
router.post('/:id/topup', authenticateToken as any, topUpSavings);

export default router;