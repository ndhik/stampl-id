import { headers } from "next/headers"
import { type NextRequest } from "next/server"
import { memberHandlers } from "@/lib/auth-member"
import { tenantHandlers } from "@/lib/auth-tenant"

async function getHandlers() {
  const host = (await headers()).get("host") || ""
  return host.startsWith("tenant.") ? tenantHandlers : memberHandlers
}

export async function GET(req: NextRequest) {
  const h = await getHandlers()
  return h.GET(req)
}

export async function POST(req: NextRequest) {
  const h = await getHandlers()
  return h.POST(req)
}
