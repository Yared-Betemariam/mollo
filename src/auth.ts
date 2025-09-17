import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { db } from "./db";
import { users } from "./db/schema";
import { cookies } from "next/headers";

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  session: { strategy: "jwt" },
  callbacks: {
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      try {
        const [user] = await db
          .select({
            id: users.id,
            email: users.email,
          })
          .from(users)
          .where(eq(users.email, token.email as string));

        if (!user) return token;

        token.sub = user.id.toString();
        token.email = user.email;

        return token;
      } catch (error) {
        console.log(error);
        return token;
      }
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        try {
          if (!profile?.email) return false;

          const [user] = await db
            .select({
              id: users.id,
            })
            .from(users)
            .where(eq(users.email, profile.email));

          if (!user) {
            // signup logic
            const cookieStore = await cookies();
            const rId = cookieStore.get("ref")?.value ?? null;

            await db.insert(users).values({
              email: profile.email,
              ...(rId ? { rId } : {}),
            });

            return true;
          }

          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
});
