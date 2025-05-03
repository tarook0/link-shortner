// server/src/db/setup.ts
import { Pool } from 'pg';
import dotenv from 'dotenv';

// Load environment variables first
dotenv.config({ path: '../../.env' }); // Adjust path if needed

// Create connection pool with explicit configuration
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: "1234",
  database:'link_shortener',
  ssl: false,
  connectionTimeoutMillis: 2000,
});

export async function setupDatabase() {
  try {
    // Verify connection first
    await pool.query('SELECT 1');
    console.log('Successfully connected to database');

    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS urls (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_code VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        clicks INTEGER NOT NULL DEFAULT 0,
        last_accessed TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code);
    `);
    
    console.log('Database tables verified/created');
  } catch (err) {
    console.error('Database setup failed:');
    console.error('- Verify database is running');
    console.error('- Check connection credentials in .env');
    console.error('- Ensure user has proper privileges');
    console.error('Raw error:', err);
    process.exit(1);
  }
}