import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, slug, category, city, stampCount, rewardText, validityMonths, welcomingReward, welcomingText, themeId, stampDesignId } = body

  const existing = await db.tenant.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  const tenant = await db.tenant.create({
    data: {
      slug: finalSlug, name, category, city, stampCount, rewardText,
      validityMonths, welcomingReward, welcomingText,
      themeId, stampDesignId, ownerId: session.user.id, onboardingDone: true,
    },
  })

  return NextResponse.json({ id: tenant.id, slug: tenant.slug })
}
