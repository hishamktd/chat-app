import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import PgAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

// Correctly type the pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export const authOptions: NextAuthOptions = {
  adapter: PgAdapter(pool),
  secret: process.env.NEXT_AUTHSECRET,
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check for credentials
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Invalid username or password");
        }

        try {
          const res = await pool.query(
            `SELECT id, username, password, email FROM users WHERE username = $1`,
            [credentials.username]
          );

          const user = res.rows[0];

          if (!user) {
            throw new Error("No user found with the given username");
          }

          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // Return user object matching the expected type
          return { id: user.id, name: user.username, email: user.email };
        } catch (error) {
          console.error("Error in authorize:", error);
          // Return null instead of undefined to match the expected type
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      try {
        const tokenString = uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 4);

        await pool.query(
          `INSERT INTO user_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)`,
          [token.id, tokenString, expiresAt]
        );

        token.tokenString = tokenString;
        token.expiresAt = expiresAt;
      } catch (error) {
        console.error("Error in jwt callback:", error);
      }

      return token;
    },
    async session({ session, token }) {
      if (token && token.id) {
        session.user = {
          id: token.id as string,
          username: token.name,
          email: token.email,
        };
      } else {
        throw new Error("Token or token.id is missing");
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
