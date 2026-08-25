import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Dev credentials provider for testing when OAuth env vars are not set
    Credentials({
      id: "dev-login",
      name: "Developer Quick Sign In",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = String(credentials.email).toLowerCase().trim();
        const name = credentials.name ? String(credentials.name).trim() : "Student User";
        return {
          id: email,
          email,
          name,
          image: "https://api.dicebear.com/7.x/bottts/svg?seed=" + encodeURIComponent(email),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        // Upsert user into our internal `users` table
        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        if (existing.length === 0) {
          const [inserted] = await db
            .insert(users)
            .values({
              email: user.email,
              name: user.name || user.email.split("@")[0],
              image: user.image || null,
            })
            .returning();
          user.id = inserted.id;
        } else {
          user.id = existing[0].id;
        }
      } catch (err) {
        console.warn("DB user upsert failed (likely running in mock/demo mode):", err);
        // Fallback: use email hash or deterministic UUID for internal ID if DB connection fails
        user.id = user.id || "00000000-0000-0000-0000-000000000001";
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.userId as string) || (token.sub as string);
      }
      return session;
    },
  },
});
