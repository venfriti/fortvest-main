// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// We extend the standard Request to include the 'user' payload
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Get the token from the Header
  // The client sends: "Authorization: Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get the part after "Bearer"

  if (!token) {
    res.status(401).json({ error: 'Access denied. No token provided.' });
    return;
  }

  try {
    // 2. Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_dont_use_in_production'
    );

    // 3. Attach user info to the request object so the next function can use it
    req.user = decoded as { id: number; email: string };
    
    // 4. Move to the next stop (the actual controller)
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};