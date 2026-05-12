import NextAuth, { NextAuthOptions } from "next-auth"
import LineProvider from "next-auth/providers/line"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID || "",
      clientSecret: process.env.LINE_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: 'profile openid email',
          bot_prompt: 'aggressive'
        }
      }
    }),
  ],
  pages: {
    signIn: '/login', // We might need to create this page, or just use default. Actually, we'll probably trigger login directly from the booking flow. Let's keep it default for now by removing it.
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
