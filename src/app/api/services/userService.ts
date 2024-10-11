// app/api/services/userService.ts

import { Pool } from "pg"; // Ensure you have imported the Pool
import { TUser } from "@/types/user"; // Adjust the path based on your project structure

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Define a function to get user by ID
export async function getUserById(userId: string): Promise<TUser | null> {
  try {
    const result = await pool.query(
      `SELECT id, username, email FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return null; // User not found
    }

    return result.rows[0]; // Return the user object
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw new Error("Could not retrieve user");
  }
}
