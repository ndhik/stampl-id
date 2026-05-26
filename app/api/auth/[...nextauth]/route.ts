import { headers } from "next/headers"
import { memberHandlers } from "@/lib/auth-member"
import { tenantHandlers } from "@/lib/auth-tenant"

async function getHandlers() {
  const host = (await headers()).get("host") || ""
  return host.startsWith("tenant.") ? tenantHandlers : memberHandlers
}

export async function GET(req: Request, ctx: { params: Promise<{ nextauth: string[] }> }) {
  const h = await getHandlers()
  return h.GET(req, ctx as never)
}

export async function POST(req: Request, ctx: { params: Promise<{ nextauth: string[] }> }) {
  const h = await getHandlers()
  return h.POST(req, ctx as never)
}
