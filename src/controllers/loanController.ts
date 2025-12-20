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

export const repayLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const loanId = req.params.id;
  const { amount } = req.body; // Amount to pay back in KOBO/CENTS

  if (!amount || amount <= 0) {
    res.status(400).json({ error: 'Valid amount is required' });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Get the Loan
    const loanRes = await client.query(
      'SELECT * FROM loans WHERE id = $1 AND user_id = $2 FOR UPDATE',
      [loanId, userId]
    );
    const loan = loanRes.rows[0];

    if (!loan) {
        await client.query('ROLLBACK');
        res.status(404).json({ error: 'Loan not found' });
        return;
    }

    if (loan.status === 'PAID') {
        await client.query('ROLLBACK');
        res.status(400).json({ error: 'Loan is already fully paid' });
        return;
    }

    // 2. Check Wallet Balance
    const walletRes = await client.query(
        'SELECT balance FROM wallets WHERE user_id = $1 FOR UPDATE',
        [userId]
    );
    const currentBalance = Number(walletRes.rows[0].balance);

    if (currentBalance < amount) {
        await client.query('ROLLBACK');
        res.status(400).json({ error: 'Insufficient funds in wallet' });
        return;
    }

    // 3. Logic: Don't let them overpay
    // If they owe 5000 and try to pay 6000, only take 5000.
    // Note: In Postgres, bigint comes back as string, so we convert.
    const currentDebt = Number(loan.repayment_amount); 
    const actualPayment = amount > currentDebt ? currentDebt : amount;

    // 4. Debit Wallet
    await client.query(
        'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2',
        [actualPayment, userId]
    );

    // 5. Update Loan
    const newDebt = currentDebt - actualPayment;
    const newStatus = newDebt <= 0 ? 'PAID' : 'ACTIVE';
    
    await client.query(
        'UPDATE loans SET repayment_amount = $1, status = $2 WHERE id = $3',
        [newDebt, newStatus, loanId]
    );

    // 6. Record Transaction
    const reference = `LOAN-REPAY-${Date.now()}`;
    await client.query(
        `INSERT INTO transactions (user_id, amount, type, category, status, reference)
         VALUES ($1, $2, 'DEBIT', 'LOAN_REPAYMENT', 'SUCCESS', $3)`,
        [userId, actualPayment, reference]
    );

    await client.query('COMMIT');

    res.json({
        message: 'Repayment successful',
        paid: actualPayment,
        remaining_debt: newDebt,
        status: newStatus
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Repayment Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};