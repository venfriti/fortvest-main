// src/controllers/investmentController.ts
import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';

// POST /api/investments (Admin Only)
export const createOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
  const adminId = req.user?.id;
  const { title, description, unit_price, roi_percentage, duration_months } = req.body;

  // 1. Check Admin Privileges
  const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [adminId]);
  if (!adminCheck.rows[0]?.is_admin) {
    res.status(403).json({ error: 'Access denied. Admins only.' });
    return;
  }

  // 2. Validate Input
  if (!title || !unit_price || !roi_percentage) {
    res.status(400).json({ error: 'Title, Price, and ROI are required' });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO investment_opportunities 
       (title, description, unit_price, roi_percentage, duration_months)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, unit_price, roi_percentage, duration_months]
    );

    res.status(201).json({
      message: 'Investment opportunity created successfully',
      opportunity: result.rows[0]
    });

  } catch (error) {
    console.error('Create Investment Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/investments
export const getOpportunities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Show active investments only
    const result = await pool.query(
      'SELECT * FROM investment_opportunities WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch investments' });
  }
};

export const investInOpportunity = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const investmentId = req.params.id;
  const { units } = req.body; // How many units to buy

  if (!units || units < 1) {
    res.status(400).json({ error: 'Valid number of units is required' });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Fetch the Opportunity (to get the price)
    const oppRes = await client.query(
        'SELECT * FROM investment_opportunities WHERE id = $1',
        [investmentId]
    );
    const opportunity = oppRes.rows[0];

    if (!opportunity) {
        await client.query('ROLLBACK');
        res.status(404).json({ error: 'Investment opportunity not found' });
        return;
    }

    // 2. Calculate Total Cost
    const totalCost = Number(opportunity.unit_price) * units;

    // 3. Check Wallet Balance
    const walletRes = await client.query(
        'SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE',
        [userId]
    );
    const currentBalance = Number(walletRes.rows[0].balance);

    if (currentBalance < totalCost) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: 'Insufficient funds in wallet' });
        return;
    }

    // 4. Deduct Money
    await client.query(
        'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2',
        [totalCost, userId]
    );

    // 5. Create User Investment Record
    await client.query(
        `INSERT INTO user_investments (user_id, investment_id, units_owned, amount_invested)
         VALUES ($1, $2, $3, $4)`,
        [userId, investmentId, units, totalCost]
    );

    // 6. Record Transaction
    const reference = `INV-BUY-${Date.now()}`;
    await client.query(
        `INSERT INTO transactions (user_id, amount, type, category, status, reference)
         VALUES ($1, $2, 'DEBIT', 'INVESTMENT_PURCHASE', 'SUCCESS', $3)`,
        [userId, totalCost, reference]
    );

    await client.query('COMMIT');

    res.json({
        message: 'Investment successful',
        units_purchased: units,
        total_cost: totalCost,
        opportunity: opportunity.title
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Investment Purchase Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};

// GET /api/investments/my-investments
export const getMyInvestments = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    try {
        const result = await pool.query(
            `SELECT ui.*, io.title, io.roi_percentage 
             FROM user_investments ui
             JOIN investment_opportunities io ON ui.investment_id = io.id
             WHERE ui.user_id = $1`,
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch investments' });
    }
};
