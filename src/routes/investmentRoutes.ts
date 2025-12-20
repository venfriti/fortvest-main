// src/routes/investmentRoutes.ts
import { Router } from 'express';
import { createOpportunity, getOpportunities, investInOpportunity, getMyInvestments } from '../controllers/investmentController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Public: View all investments
router.get('/', authenticateToken as any, getOpportunities);

// Admin: Create new investment
router.post('/', authenticateToken as any, createOpportunity);

// User: Buy Investment
router.post('/:id/invest', authenticateToken as any, investInOpportunity);

// User: See user owns
router.get('/my-investments', authenticateToken as any, getMyInvestments);

export default router;