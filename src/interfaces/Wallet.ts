// src/interfaces/Wallet.ts

export interface Wallet {
  id: number;
  user_id: number;
  balance: number; // Always integer (Kobo/Cents). 0 means ₦0.00
  currency: string; // Default 'NGN'
  created_at: Date;
}