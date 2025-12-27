import { pool } from "../config/database";

async function testDb() {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Database is working! Current time:", res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("❌ Database test failed:", err);
    process.exit(1);
  }
}

testDb();
