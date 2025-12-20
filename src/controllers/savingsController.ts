import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';

// POST /api/savings
export const createSavingsPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { title, target_amount, type } = req.body;

  // 1. Validation
  if (!title || !target_amount) {
    res.status(400).json({ error: 'Title and Target Amount are required' });
    return;
  }

  // Default to 'FIXED' if they don't specify, and ensure Interest Rate is set (e.g., 10%)
  const planType = type || 'FIXED';
  const interestRate = 10.00; 

  try {
    // 2. Create the Plan
    const result = await pool.query(
      `INSERT INTO savings_plans 
       (user_id, title, target_amount, current_balance, type, interest_rate)
       VALUES ($1, $2, $3, 0, $4, $5)
       RETURNING *`,
      [userId, title, target_amount, planType, interestRate]
    );

    res.status(201).json({
      message: 'Savings plan created successfully',
      plan: result.rows[0]
    });

  } catch (error) {
    console.error('Create Savings Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/savings
export const getMySavings = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    try {
        const result = await pool.query(
            'SELECT * FROM savings_plans WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch savings plans' });
    }
};

export const topUpSavings = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const planId = req.params.id;
  const { amount } = req.body; // Amount in KOBO/CENTS

  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'Valid amount is required' });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Check Wallet Balance (Do they have the money?)
    const walletRes = await client.query(
        'SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE',
        [userId]
    );
    const currentWalletBalance = Number(walletRes.rows[0].balance);

    if (currentWalletBalance < amount) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: 'Insufficient funds in main wallet' });
        return;
    }

    // 2. Verify Savings Plan Ownership
    const planRes = await client.query(
        'SELECT id FROM savings_plans WHERE id = $1 AND user_id = $2',
        [planId, userId]
    );
    if (planRes.rows.length === 0) {
        await client.query('ROLLBACK');
        res.status(404).json({ error: 'Savings plan not found' });
        return;
    }

    // 3. Deduct from Wallet
    await client.query(
        'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2',
        [amount, userId]
    );

    // 4. Add to Savings Plan
    await client.query(
        'UPDATE savings_plans SET current_balance = current_balance + $1 WHERE id = $2',
        [amount, planId]
    );

    // 5. Record Transaction
    const reference = `SAVE-TOPUP-${Date.now()}`;
    await client.query(
        `INSERT INTO transactions (user_id, amount, type, category, status, reference)
         VALUES ($1, $2, 'DEBIT', 'SAVINGS_TOPUP', 'SUCCESS', $3)`,
        [userId, amount, reference]
    );

    await client.query('COMMIT');

    res.json({
        message: 'Top-up successful',
        amount_saved: amount,
        reference
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Savings Top-up Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};