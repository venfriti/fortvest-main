// src/interfaces/Loan.ts

// 1. Define allowed statuses strictly. 
// This prevents bugs where you might type 'pending' (lowercase) vs 'PENDING' (uppercase).
export type LoanStatus = 'PENDING' | 'APPROVED' | 'ACTIVE' | 'PAID' | 'OVERDUE' | 'REJECTED';

export interface Loan {
  id: number;
  user_id: number;
  
  /**
   * MONEY HANDLING WARNING:
   * Store these as integers (Cents/Kobo). 
   * Example: ₦5,000.00 should be stored as 500000
   */
  principal_amount: number; 
  repayment_amount: number;
  
  interest_rate: number; // Stored as decimal, e.g., 5.5 (for 5.5%)
  duration_months: number;
  
  status: LoanStatus;
  due_date: Date | null; // Null if the loan hasn't been approved/started yet
  created_at: Date;
}

// The data required to apply for a loan
export interface CreateLoanDTO {
  user_id: number;
  principal_amount: number; // Frontend sends this in Kobo/Cents
  duration_months: number;
}