import NextAuth, { NextAuthOptions } from "next-auth"
import LineProvider from "next-auth/providers/line"
import { prisma } from "@/lib/prisma"

// Force correct URL in production to prevent OAuthCallback error if Railway env is stale
process.env.NEXTAUTH_URL = "https://mhami.me"
process.env.NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "mhami_super_secret_fallback_key_2026"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "mhami_super_secret_fallback_key_2026",
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
          image: profile.picture || "",
        };
      }
    }),
  ],
  useSecureCookies: true,
  cookies: {
    pkceCodeVerifier: {
      name: `__Secure-next-auth.pkce.code_verifier`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    state: {
      name: `__Secure-next-auth.state`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: true,
      },
    },
  },
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
              name: "", // Force user to fill it in
              email: `${lineId}@line.dummy`,
              image: user.image || "",
            },
            update: {
              image: user.image || "", // Don't overwrite the manually typed name
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
        
        // Fetch true role from database to ensure Admins get their crown
        try {
          let dbRole = "USER";
          const dbUser = await prisma.user.findFirst({
            where: {
              OR: [
                { id: lineId },
                { email: `${lineId}@line.dummy` }
              ]
            }
          });
          
          if (dbUser) {
            dbRole = dbUser.role;
          } else {
            // Check old PrismaAdapter linked accounts
            const account = await prisma.account.findFirst({
              where: { provider: 'line', providerAccountId: lineId },
              include: { user: true }
            });
            if (account) dbRole = account.user.role;
          }
          token.role = dbRole;
        } catch (error) {
          console.error("Error fetching user role:", error);
          token.role = "USER";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        session.user.email = token.email as string;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
