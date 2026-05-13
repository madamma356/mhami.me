import NextAuth, { NextAuthOptions } from "next-auth"
import LineProvider from "next-auth/providers/line"
import { prisma } from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID || "",
      clientSecret: process.env.LINE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: 'profile openid',
          bot_prompt: 'aggressive'
        }
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: `${profile.sub}@line.dummy`,
          image: profile.picture,
        };
      }
    }),
  ],
  pages: {
    signIn: '/member/login',
  },
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, profile }) {
      try {
        const lineId = profile?.sub || user.id;
        if (lineId) {
          // Manually upsert user to database, bypassing NextAuth strict Adapter rules
          await prisma.user.upsert({
            where: { email: `${lineId}@line.dummy` },
            create: {
              name: user.name || "คุณลูกค้า",
              email: `${lineId}@line.dummy`,
              image: user.image || "",
            },
            update: {
              name: user.name || "คุณลูกค้า",
              image: user.image || "",
            }
          });
        }
      } catch (error) {
        console.error("DB Upsert Error:", error);
      }
      return true;
    },
    async jwt({ token, user, profile }) {
      if (user) {
        const lineId = profile?.sub || user.id;
        token.id = lineId;
        token.email = `${lineId}@line.dummy`;
        token.role = "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        session.user.email = token.email as string;
      }
      return session;
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
