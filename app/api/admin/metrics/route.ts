import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies()
  if (!cookieStore.get("admin-session")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const [totalTenants, totalUsers, totalStamps, pendingInvoices, paidThisMonth] = await Promise.all([
    db.tenant.count({ where: { isActive: true } }),
    db.user.count(),
    db.stampEvent.count(),
    db.invoice.count({ where: { status: "pending" } }),
    db.invoice.findMany({
      where: {
        status: "paid",
        paidAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
      select: { amount: true, uniqueCode: true },
    }),
  ])

  const mrr = paidThisMonth.reduce((sum: number, inv: { amount: number; uniqueCode: number }) => sum + inv.amount + inv.uniqueCode, 0)

  return NextResponse.json({ totalTenants, totalUsers, totalStamps, pendingInvoices, mrr })
}
