import prisma from '@/lib/prisma';
import { TUser } from '@/types/user';

export const getUserById = async (
  userId: number | null
): Promise<TUser | null> => {
  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return user || null;
  } catch (error) {
    console.error('Error retrieving user:', error);
    throw new Error('Could not retrieve user');
  }
};
