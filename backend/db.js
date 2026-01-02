import dotenv from "dotenv";
import pg from "pg";

dotenv.config();
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon/Supabase usually require SSL
  ssl: { rejectUnauthorized: false },
});

// optional: quick test helper
export async function dbQuery(text, params) {
  return pool.query(text, params);
}
