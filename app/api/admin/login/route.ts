import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { nanoid } from "nanoid"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH!)
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  const token = nanoid(32)
  const res = NextResponse.json({ ok: true })
  res.cookies.set("admin-session", token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
