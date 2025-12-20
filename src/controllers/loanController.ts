import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';
import { CreateLoanDTO } from '../interfaces/Loan';

// CONSTANTS (In a real app, these might come from a DB setting)
const INTEREST_RATE_PERCENT = 10; // 10% flat rate

// POST /api/loans/apply
export const applyForLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { principal_amount, duration_months }: CreateLoanDTO = req.body;

  // 1. Validate Input
  if (!principal_amount || principal_amount <= 0) {
    res.status(400).json({ error: 'Valid principal amount is required' });
    return;
  }
  if (!duration_months || duration_months < 1) {
    res.status(400).json({ error: 'Duration must be at least 1 month' });
    return;
  }

  try {
    // 2. Calculate Repayment (Simple Interest Logic)
    // Formula: Principal + (Principal * Rate/100)
    // Note: We use Math.floor to keep it an integer (Kobo/Cents)
    const interestAmount = Math.floor(principal_amount * (INTEREST_RATE_PERCENT / 100));
    const totalRepayment = principal_amount + interestAmount;

    // 3. Save to Database
    // Status defaults to 'PENDING' automatically via SQL default
    const result = await pool.query(
      `INSERT INTO loans 
       (user_id, principal_amount, interest_rate, duration_months, repayment_amount)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, principal_amount, INTEREST_RATE_PERCENT, duration_months, totalRepayment]
    );

    res.status(201).json({
      message: 'Loan application submitted successfully',
      loan: result.rows[0]
    });

  } catch (error) {
    console.error('Loan Application Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/loans/my-loans
export const getMyLoans = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;

    try {
        const result = await pool.query(
            'SELECT * FROM loans WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch loans' });
    }
};