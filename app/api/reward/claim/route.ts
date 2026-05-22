import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { membershipId } = await req.json()
    const membership = await db.membership.findUnique({
      where: { id: membershipId },
      include: { tenant: true },
    })

    if (!membership || membership.tenantId !== session.user.tenantId) {
      return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
    }

    if (membership.stampsCollected < membership.tenant.stampCount) {
      return NextResponse.json({ error: "Stamp belum penuh" }, { status: 400 })
    }

    await db.$transaction([
      db.rewardClaim.create({ data: { membershipId } }),
      db.membership.update({
        where: { id: membershipId },
        data: { stampsCollected: 0 },
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Gagal" }, { status: 500 })
  }
}
