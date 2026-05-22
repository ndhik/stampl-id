import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      tenantId?: string
      tenantSlug?: string
      tenantPlan?: string
      onboardingDone?: boolean
    } & DefaultSession["user"]
  }
}
