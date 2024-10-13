import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { getUserById } from '../services/userService';

export const GET = async () => {
  try {
    const messages = await prisma.chat_room_messages.findMany({
      orderBy: {
        created_at: 'asc',
      },
    });

    const enrichedMessages = await Promise.all(
      messages.map(async (message) => {
        const user = await getUserById(message.userid);
        return {
          id: message.id,
          user: user ?? null,
          text: message.text,
          created_at: message.created_at,
        };
      })
    );

    return NextResponse.json(enrichedMessages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return NextResponse.json(
      { error: 'Error retrieving messages.' },
      { status: 500 }
    );
  }
};

export const POST = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { text } = await req.json();
  const userId = session.user.id;

  try {
    const newMessage = await prisma.chat_room_messages.create({
      data: {
        userid: userId,
        text,
      },
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Error sending message.' },
      { status: 500 }
    );
  }
};
