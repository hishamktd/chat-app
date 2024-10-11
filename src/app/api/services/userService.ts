import { Pool } from 'pg';

import { TUser } from '@/types/user';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function getUserById(userId: string): Promise<TUser | null> {
  try {
    const result = await pool.query(
      `SELECT id, username, email FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error retrieving user:', error);
    throw new Error('Could not retrieve user');
  }
}
