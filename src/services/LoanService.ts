import { Loan, CreateLoanDTO } from '../interfaces/Loan';

// This function will now yell at you if you try to return data that doesn't look like a Loan
const createLoan = async (data: CreateLoanDTO): Promise<Loan> => {
    // Your logic to calculate interest
    const interest = 10; // 10%
    const repayment = data.principal_amount + (data.principal_amount * (interest / 100));

    // When saving to DB, TypeScript ensures you don't forget fields
    const newLoan: Loan = {
        id: 1, // This usually comes from DB
        user_id: data.user_id,
        principal_amount: data.principal_amount,
        repayment_amount: repayment,
        interest_rate: interest,
        duration_months: data.duration_months,
        status: 'PENDING', // TypeScript will error if you type "WAITING"
        due_date: null,
        created_at: new Date()
    };

    return newLoan;
};