import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { sendPlanActivatedEmail } from "@/lib/resend"
import { cookies } from "next/headers"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const adminSession = cookieStore.get("admin-session")
  if (!adminSession) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  try {
    const invoice = await db.invoice.findUnique({
      where: { id },
      include: { tenant: { include: { owner: true } } },
    })

    if (!invoice || invoice.status !== "pending") {
      return NextResponse.json({ error: "Invoice tidak valid" }, { status: 400 })
    }

    const periodDays = invoice.period === "yearly" ? 365 : 30
    const periodEnd = new Date(Date.now() + periodDays * 24 * 60 * 60 * 1000)

    await db.$transaction([
      db.invoice.update({
        where: { id: invoice.id },
        data: { status: "paid", paidAt: new Date() },
      }),
      db.tenant.update({
        where: { id: invoice.tenantId },
        data: { plan: invoice.plan },
      }),
      db.subscription.upsert({
        where: { tenantId: invoice.tenantId },
        update: { plan: invoice.plan, status: "active", currentPeriodEnd: periodEnd },
        create: { tenantId: invoice.tenantId, plan: invoice.plan, currentPeriodEnd: periodEnd },
      }),
    ])

    await sendPlanActivatedEmail(
      invoice.tenant.owner.email!,
      invoice.tenant.name,
      invoice.plan,
      periodEnd
    )

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Gagal" }, { status: 500 })
  }
}
