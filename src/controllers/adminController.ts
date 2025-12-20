import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';

// PATCH /api/admin/loans/:id/approve
export const approveLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  const adminId = req.user?.id;
  const loanId = req.params.id;

  // 1. Security Check (Basic)
  // In a real app, middleware handles this. For now, we check the DB.
  const adminCheck = await pool.query('SELECT is_admin FROM users WHERE id = $1', [adminId]);
  if (!adminCheck.rows[0]?.is_admin) {
    res.status(403).json({ error: 'Access denied. Admins only.' });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 2. Fetch the Loan (Lock it so no one else touches it)
    const loanResult = await client.query(
      'SELECT * FROM loans WHERE id = $1 FOR UPDATE',
      [loanId]
    );
    const loan = loanResult.rows[0];

    if (!loan) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Loan not found' });
      return;
    }

    if (loan.status !== 'PENDING') {
      await client.query('ROLLBACK');
      res.status(400).json({ error: 'Loan is not in pending status' });
      return;
    }

    // 3. Calculate Due Date (Current Time + Duration)
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + loan.duration_months);

    // 4. Update Loan Status
    await client.query(
      `UPDATE loans 
       SET status = 'ACTIVE', due_date = $1 
       WHERE id = $2`,
      [dueDate, loanId]
    );

    // 5. Credit User's Wallet (The Payout)
    await client.query(
      `UPDATE wallets SET balance = balance + $1 WHERE user_id = $2`,
      [loan.principal_amount, loan.user_id]
    );

    // 6. Create Transaction Record
    const reference = `LOAN-DISB-${Date.now()}`;
    await client.query(
      `INSERT INTO transactions (user_id, amount, type, category, status, reference)
       VALUES ($1, $2, 'CREDIT', 'LOAN_DISBURSEMENT', 'SUCCESS', $3)`,
      [loan.user_id, loan.principal_amount, reference]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Loan approved and funds disbursed successfully',
      loanId: loan.id,
      amount_disbursed: loan.principal_amount
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Approval Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    client.release();
  }
};