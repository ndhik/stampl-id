import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    include: {
      tenant: {
        select: {
          id: true, slug: true, name: true, logoUrl: true,
          stampCount: true, themeId: true, stampDesignId: true,
        },
      },
    },
    orderBy: { lastStampAt: "desc" },
  })

  return NextResponse.json(memberships)
}
