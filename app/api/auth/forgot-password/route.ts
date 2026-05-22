import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { sendPasswordResetEmail } from "@/lib/resend"
import { nanoid } from "nanoid"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const user = await db.user.findUnique({ where: { email } })
    // Always return success to prevent email enumeration
    if (!user) return NextResponse.json({ ok: true })

    const token = nanoid(32)
    await redis.set(`pwd-reset:${token}`, user.id, { ex: 3600 })

    const resetUrl = `${process.env.NEXT_PUBLIC_TENANT_URL}/auth/reset-password?token=${token}`
    await sendPasswordResetEmail(email, resetUrl)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Gagal" }, { status: 500 })
  }
}
