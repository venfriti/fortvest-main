// src/config/database.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Event listener for successful connection (Optional, but good for debugging)
pool.on('connect', () => {
  console.log('📦 Connected to the Fortvest Database successfully!');
});

// Event listener for errors (Important for catching crashes)
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Export a query function that we can use in our controllers/models
export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;