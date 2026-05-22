import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendNewMemberEmail } from "@/lib/resend"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.redirect(new URL("/auth/login", req.url))

  const formData = await req.formData()
  const tenantId = formData.get("tenantId") as string

  const tenant = await db.tenant.findUnique({ where: { id: tenantId }, include: { owner: true } })
  if (!tenant) return NextResponse.json({ error: "Tenant tidak ditemukan" }, { status: 404 })

  const existing = await db.membership.findUnique({
    where: { userId_tenantId: { userId: session.user.id, tenantId } },
  })
  if (existing) return NextResponse.redirect(new URL(`/${tenant.slug}`, req.url))

  await db.membership.create({ data: { userId: session.user.id, tenantId } })
  await sendNewMemberEmail(tenant.owner.email!, tenant.name, session.user.name || "Member baru").catch(() => {})

  return NextResponse.redirect(new URL(`/${tenant.slug}`, req.url))
}
