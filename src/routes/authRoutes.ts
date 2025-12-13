// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Route: POST /api/auth/register
router.post('/register', register);
router.post('/login', login);

export default router;