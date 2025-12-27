import { Pool } from 'pg';
import { ENV } from "./env";

export const pool = new Pool({
  connectionString: ENV.DATABASE_URL,
  ssl: ENV.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
})

export async function verifyDatabaseConnection() {
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connection verified");
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
    process.exit(1);
  }
}

// Event listener for successful connection (Optional, but good for debugging)
pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error", err);
  process.exit(1);
});

// Export a query function that we can use in our controllers/models
export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;