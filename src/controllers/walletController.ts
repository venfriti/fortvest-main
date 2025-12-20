import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';

// POST /api/wallet/fund
export const fundWallet = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id; // Comes from the middleware
  const { amount } = req.body; // Expecting amount in KOBO/CENTS (Integers)

  // 1. Validation
  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'Valid amount is required' });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 2. Create the Transaction Record (The "Receipt")
    // We generate a fake reference since we don't have Paystack yet
    const reference = `REF-${Date.now()}-${userId}`;
    
    await client.query(
      `INSERT INTO transactions (user_id, amount, type, category, status, reference)
       VALUES ($1, $2, 'CREDIT', 'WALLET_FUNDING', 'SUCCESS', $3)`,
      [userId, amount, reference]
    );

    // 3. Update the Wallet Balance
    // Notice we do "balance = balance + $2" to be safe against race conditions
    await client.query(
      `UPDATE wallets SET balance = balance + $1 WHERE user_id = $2`,
      [amount, userId]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Wallet funded successfully',
      amount_funded: amount,
      reference
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Funding Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

// GET /api/wallet/balance
export const getBalance = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    try {
        const result = await pool.query(
            'SELECT balance, currency FROM wallets WHERE user_id = $1',
            [userId]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch balance' });
    }
};