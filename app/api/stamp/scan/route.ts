import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { membershipId, token } = await req.json()
    if (!membershipId) return NextResponse.json({ error: "Invalid QR" }, { status: 400 })

    const membership = await db.membership.findUnique({
      where: { id: membershipId },
      include: { tenant: true, user: true },
    })

    if (!membership || membership.tenantId !== session.user.tenantId) {
      return NextResponse.json({ error: "Member tidak ditemukan" }, { status: 404 })
    }

    const tenant = membership.tenant

    // Check daily limit
    if (tenant.dailyLimit) {
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayStamps = await db.stampEvent.count({
        where: { membershipId, createdAt: { gte: todayStart } },
      })
      if (todayStamps >= tenant.dailyLimit) {
        return NextResponse.json({ error: "Batas stamp harian tercapai" }, { status: 400 })
      }
    }

    const newCount = membership.stampsCollected + 1
    const isRewardReady = newCount >= tenant.stampCount

    await db.$transaction([
      db.stampEvent.create({
        data: { membershipId, stampedById: session.user.id, method: "qr_scan" },
      }),
      db.membership.update({
        where: { id: membershipId },
        data: { stampsCollected: newCount, lastStampAt: new Date() },
      }),
    ])

    return NextResponse.json({
      ok: true,
      memberName: membership.user.name,
      stampsCollected: newCount,
      stampCount: tenant.stampCount,
      isRewardReady,
    })
  } catch {
    return NextResponse.json({ error: "Gagal" }, { status: 500 })
  }
}
