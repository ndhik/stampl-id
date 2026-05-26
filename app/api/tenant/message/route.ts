import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-tenant"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { content } = await req.json()
  const message = await db.message.create({
    data: { tenantId: session.user.tenantId, content },
  })
  return NextResponse.json(message)
}
