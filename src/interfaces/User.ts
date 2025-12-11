// src/interfaces/User.ts

export interface User {
  id: number;
  full_name: string;
  email: string;
  password_hash: string; // Internal use only, never send this to the frontend
  phone_number?: string; // Optional because it might not be set immediately
  is_verified: boolean;
  created_at: Date;
}

// Useful for type-checking the input from your Registration Form
export interface CreateUserDTO {
  full_name: string;
  email: string;
  password: string;
  phone_number: string;
}

// Useful for the response sent back to the client (hiding the password)
export interface UserResponseDTO {
  id: number;
  full_name: string;
  email: string;
  is_verified: boolean;
  token?: string; // JWT Token
}