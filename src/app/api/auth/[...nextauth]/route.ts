import { compare } from 'bcrypt';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { v4 as uuidv4 } from 'uuid';

import prisma from '@/lib/prisma';
import { isNumber } from '@/utils/common';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTHSECRET,
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Record<'username' | 'password', string> | undefined
      ) {
        if (!credentials || !credentials.username || !credentials.password) {
          throw new Error('Invalid username or password');
        }

        try {
          const user = await prisma.users.findFirst({
            where: {
              username: credentials.username,
            },
          });

          if (!user) {
            throw new Error('No user found with the given username');
          }

          const isValidPassword = await compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error('Invalid password');
          }

          return {
            id: String(user.id),
            username: user.username,
            email: user.email,
          };
        } catch (error) {
          console.error('Error in authorize:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
        token.email = user.email;
      }

      try {
        const tokenString = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 4);

        if (isNumber(token.id)) {
          await prisma.user_tokens.create({
            data: {
              user_id: token.id,
              token: tokenString,
              expires_at: expiresAt,
            },
          });
        } else {
          console.log('User id is not a number');
        }

        token.tokenString = tokenString;
        token.expiresAt = expiresAt;
      } catch (error) {
        console.error('Error in jwt callback:', error);
      }

      return token;
    },
    async session({ session, token }) {
      if (token && token.id) {
        session.user = {
          id: Number(token.id),
          username: token.name,
          email: token.email,
        };
      } else {
        throw new Error('Token or token.id is missing');
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
