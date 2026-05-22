import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  if (!cookieStore.get("admin-session")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { tenant: { include: { owner: { select: { email: true } } } } },
  })

  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(invoice)
}
