// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

// Public Routes (No lock)
router.post('/register', register);
router.post('/login', login);

// Protected Routes (Locked with authenticateToken)
// Note: We cast authenticateToken to 'any' to avoid complex TS middleware typing issues quickly
router.get('/me', authenticateToken as any, getProfile);


export default router;