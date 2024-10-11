// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Import your NextAuth auth options
import { Pool } from "pg";
import { io } from "socket.io-client"; // Make sure you have socket.io server side set up

// Initialize the PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get messages
export async function GET() {
  try {
    const result = await pool.query(
      "SELECT cm.id, u.username, cm.text, cm.created_at FROM chat_room_messages cm JOIN users u ON cm.userId = u.id ORDER BY cm.created_at ASC"
    );
    return NextResponse.json(result.rows);
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

    // Emit the new message using Socket.io
    const newMessage = result.rows[0];

    const socket = io(); // You need a server-side socket, not client
    socket.emit("new_message", {
      id: newMessage.id,
      user: session.user.username, // Assuming username is in the session
      text: newMessage.text,
      created_at: newMessage.created_at,
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error sending message." },
      { status: 500 }
    );
  }
}
