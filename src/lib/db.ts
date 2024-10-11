import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in the environment variables');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export { pool };
