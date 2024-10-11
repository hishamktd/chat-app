import { NextResponse } from 'next/server';

import { pool } from '@/lib/db';

export async function GET() {
  const result = await pool.query('SELECT id, username FROM users');
  return NextResponse.json(result.rows);
}
