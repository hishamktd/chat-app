// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      username?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
