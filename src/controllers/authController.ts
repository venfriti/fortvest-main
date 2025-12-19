// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import pool from '../config/database';
import { CreateUserDTO } from '../interfaces/User';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middlewares/authMiddleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { full_name, email, password, phone_number }: CreateUserDTO = req.body;

  // 1. Basic Validation
  if (!full_name || !email || !password || !phone_number) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const client = await pool.connect(); 

  try {
    // Start the transaction on THIS specific client
    await client.query('BEGIN');

    // 2. Check if user already exists
    const userCheck = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      await client.query('ROLLBACK'); // Cancel transaction
      client.release(); // Free the transaction
      res.status(409).json({ error: 'User already exists' });
      return;
    }

    // 3. Hash the password (Security First)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create the User
    // We use RETURNING id so we can use it to create the wallet immediately
    const userResult = await query(
      `INSERT INTO users (full_name, email, password_hash, phone_number) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, full_name, email, created_at`,
      [full_name, email, passwordHash, phone_number]
    );

    const newUser = userResult.rows[0];

    // 5. Create the Wallet (Critical Fintech Step)
    await query(
      `INSERT INTO wallets (user_id, balance, currency) VALUES ($1, 0, 'NGN')`,
      [newUser.id]
    );

    await client.query('COMMIT');

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
      },
    });

  } catch (error) {
      await client.query('ROLLBACK');
      console.error('Registration Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    //release the client back to the pool
    client.release();
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  try {
    // 1. Find User
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // 3. Generate JWT Token
    // We use a secret key from .env (we need to add this to .env next!)
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_dont_use_in_production',
      { expiresIn: '1d' }
    );

    // 4. Send Success Response
    res.json({
      message: 'Login successful',
      token, // The frontend will save this token
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  // Cast req to AuthRequest so TypeScript knows 'user' exists
  const authReq = req as AuthRequest; 

  try {
    // We already know who the user is because the middleware told us!
    const userId = authReq.user?.id;

    if (!userId) {
       res.status(400).json({ error: 'User ID missing' });
       return;
    }

    // Fetch user details AND their wallet balance
    const result = await pool.query( // Ensure you import 'pool'
      `SELECT u.id, u.full_name, u.email, u.phone_number, w.balance, w.currency 
       FROM users u
       LEFT JOIN wallets w ON u.id = w.user_id
       WHERE u.id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      message: 'Profile retrieved successfully',
      profile: result.rows[0]
    });

  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};