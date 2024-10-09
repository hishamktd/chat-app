import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  // Fetch messages for the given chatId
  const result = await pool.query("SELECT * FROM messages WHERE chat_id = $1", [
    chatId,
  ]);

  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  const { chatId, userId, content } = await request.json();

  // Insert new message
  const result = await pool.query(
    "INSERT INTO messages (chat_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
    [chatId, userId, content]
  );

  return NextResponse.json(result.rows[0]);
}
