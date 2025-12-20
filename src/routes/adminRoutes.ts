// src/routes/adminRoutes.ts
import { Router } from 'express';
import { approveLoan } from '../controllers/adminController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Protect this route with auth middleware
// (The controller does the extra check to see if they are an admin)
router.patch('/loans/:id/approve', authenticateToken as any, approveLoan);

export default router;