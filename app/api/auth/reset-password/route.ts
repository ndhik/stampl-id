import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    const userId = await redis.get<string>(`pwd-reset:${token}`)
    if (!userId) return NextResponse.json({ error: "Token tidak valid atau expired" }, { status: 400 })

    const hash = await bcrypt.hash(password, 12)
    await db.user.update({ where: { id: userId }, data: { passwordHash: hash } })
    await redis.del(`pwd-reset:${token}`)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Gagal" }, { status: 500 })
  }
}
