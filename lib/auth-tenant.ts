import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

const secure = process.env.NODE_ENV === "production"
const cookieOpts = { httpOnly: true, sameSite: "lax" as const, secure, path: "/" }

export const { handlers: tenantHandlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  trustHost: true,
  cookies: {
    sessionToken: { name: "tenant.session-token", options: cookieOpts },
    pkceCodeVerifier: { name: "tenant.pkce.code_verifier", options: cookieOpts },
    state: { name: "tenant.state", options: cookieOpts },
    callbackUrl: { name: "tenant.callback-url", options: cookieOpts },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      checks: ["state"],
    }),
    Credentials({
      id: "tenant-credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user?.passwordHash) return null
        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null
        return user
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const tenant = await db.tenant.findUnique({
          where: { ownerId: user.id },
          select: { id: true, slug: true, plan: true, onboardingDone: true },
        })
        token.tenantId = tenant?.id
        token.tenantSlug = tenant?.slug
        token.tenantPlan = tenant?.plan
        token.onboardingDone = tenant?.onboardingDone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.tenantId = token.tenantId as string | undefined
        session.user.tenantSlug = token.tenantSlug as string | undefined
        session.user.tenantPlan = token.tenantPlan as string | undefined
        session.user.onboardingDone = token.onboardingDone as boolean | undefined
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
})
