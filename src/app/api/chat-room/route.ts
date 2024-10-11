// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your NextAuth auth options
import { Pool } from "pg";
import { getUserById } from "@/app/api/services/userService";

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get messages
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT cm.id, 
             cm.userId, 
             cm.text, 
             cm.created_at 
      FROM chat_room_messages cm 
      ORDER BY cm.created_at ASC
    `);

    const messages = await Promise.all(
      result.rows.map(async (row) => {
        const user = await getUserById(row.userid);
        return {
          id: row.id,
          user: user ?? null,
          text: row.text,
          created_at: row.created_at,
        };
      })
    );

    return NextResponse.json(messages);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error retrieving messages." },
      { status: 500 }
    );
  }
}

// Post a new message
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text } = await req.json();
  const userId = session.user.id; // Get the logged-in user's ID

  try {
    const result = await pool.query(
      "INSERT INTO chat_room_messages (userId, text) VALUES ($1, $2) RETURNING *",
      [userId, text]
    );

    const newMessage = result.rows[0];

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error sending message." },
      { status: 500 }
    );
  }
}
