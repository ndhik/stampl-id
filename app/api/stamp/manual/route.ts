import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-tenant"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { shortId } = await req.json()
    const user = await db.user.findUnique({ where: { shortId } })
    if (!user) return NextResponse.json({ error: "Member tidak ditemukan" }, { status: 404 })

    const membership = await db.membership.findUnique({
      where: { userId_tenantId: { userId: user.id, tenantId: session.user.tenantId } },
      include: { tenant: true },
    })
    if (!membership) return NextResponse.json({ error: "Bukan member toko ini" }, { status: 404 })

    const tenant = membership.tenant
    if (tenant.dailyLimit) {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const count = await db.stampEvent.count({
        where: { membershipId: membership.id, createdAt: { gte: todayStart } },
      })
      if (count >= tenant.dailyLimit) {
        return NextResponse.json({ error: "Batas stamp harian tercapai" }, { status: 400 })
      }
    }

    const newCount = membership.stampsCollected + 1
    const isRewardReady = newCount >= tenant.stampCount

    await db.$transaction([
      db.stampEvent.create({
        data: { membershipId: membership.id, stampedById: session.user.id, method: "manual" },
      }),
      db.membership.update({
        where: { id: membership.id },
        data: { stampsCollected: newCount, lastStampAt: new Date() },
      }),
    ])

    return NextResponse.json({
      ok: true,
      memberName: user.name,
      stampsCollected: newCount,
      stampCount: tenant.stampCount,
      isRewardReady,
      membershipId: membership.id,
    })
  } catch {
    return NextResponse.json({ error: "Gagal" }, { status: 500 })
  }
}
