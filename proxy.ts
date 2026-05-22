import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") || ""

  const isAdmin = hostname.startsWith("admin.")
  const isTenant = hostname.startsWith("tenant.")
  const isMain = !isAdmin && !isTenant

  // Admin subdomain
  if (isAdmin) {
    if (pathname === "/auth/login") return NextResponse.next()
    const adminSession = request.cookies.get("admin-session")
    if (!adminSession) {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url))
  }

  // Tenant subdomain
  if (isTenant) {
    const publicPaths = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"]
    if (publicPaths.some(p => pathname.startsWith(p))) {
      return NextResponse.rewrite(new URL(`/tenant${pathname}`, request.url))
    }
    const session = await auth()
    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      )
    }
    return NextResponse.rewrite(new URL(`/tenant${pathname}`, request.url))
  }

  // Main app
  if (isMain) {
    const protectedPaths = ["/home", "/memberships", "/inbox", "/history", "/profile"]
    if (protectedPaths.some(p => pathname.startsWith(p))) {
      const session = await auth()
      if (!session) {
        return NextResponse.redirect(
          new URL(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
