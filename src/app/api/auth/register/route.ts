import { hash } from 'bcrypt';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

export const POST = async (req: Request) => {
  try {
    const { username, email, password } = await req.json();

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }
    const hashedPassword = await hash(password, 10);

    await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
