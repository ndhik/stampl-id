import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-tenant"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const messages = await db.message.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { sentAt: "desc" },
    take: 20,
  })
  return NextResponse.json(messages)
}
