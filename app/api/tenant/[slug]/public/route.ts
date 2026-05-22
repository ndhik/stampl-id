import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tenant = await db.tenant.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true, slug: true, name: true, category: true, city: true,
      logoUrl: true, description: true, themeId: true, stampDesignId: true,
      stampCount: true, rewardText: true, rewardImageUrl: true,
      welcomingReward: true, welcomingText: true,
    },
  })

  if (!tenant) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })

  const session = await auth()
  let membership = null
  if (session?.user?.id) {
    membership = await db.membership.findUnique({
      where: { userId_tenantId: { userId: session.user.id, tenantId: tenant.id } },
      select: { id: true, stampsCollected: true, createdAt: true },
    })
  }

  return NextResponse.json({ tenant, membership })
}
