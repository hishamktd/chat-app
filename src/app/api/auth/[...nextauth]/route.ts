// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { signIn } from "next-auth/react";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
