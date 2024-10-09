import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import PgAdapter from "@auth/pg-adapter";
import { Pool } from "pg";
import bcrypt from "bcrypt";

// Correctly type the pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const authOptions: NextAuthOptions = {
  adapter: PgAdapter(pool),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Invalid username or password");
        }

        // Query the database for the user
        const res = await pool.query(
          `SELECT id, username, password, email FROM users WHERE username = $1`,
          [credentials.username]
        );

        const user = res.rows[0];

        if (!user) {
          throw new Error("No user found with the given username");
        }

        // Compare the provided password with the hashed password stored in the database
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        // Return the user object if authentication is successful
        return {
          id: user.id,
          name: user.username,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
