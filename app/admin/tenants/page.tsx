import { db } from "@/lib/db"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

export default async function AdminTenantsPage() {
  const cookieStore = await cookies()
  if (!cookieStore.get("admin-session")) redirect("/auth/login")

  const tenants = await db.tenant.findMany({
    include: {
      owner: { select: { email: true } },
      subscription: { select: { plan: true, currentPeriodEnd: true, status: true } },
      _count: { select: { memberships: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E8E4DC]">
      <header className="border-b border-[#1E1E1E] px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-[#888] hover:text-[#E8E4DC] text-sm">← Dashboard</Link>
        <h1 className="font-syne font-bold text-xl">Tenants</h1>
        <span className="text-[#555] text-sm ml-auto">{tenants.length} total</span>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 text-xs text-[#555] font-syne font-bold uppercase tracking-wide border-b border-[#1E1E1E]">
            <span className="col-span-3">Bisnis</span>
            <span className="col-span-3">Email</span>
            <span className="col-span-2">Plan</span>
            <span className="col-span-2">Members</span>
            <span className="col-span-2">Bergabung</span>
          </div>
          {tenants.map((t) => (
            <div key={t.id} className="grid grid-cols-12 gap-3 px-4 py-3 border-b border-[#1A1A1A] items-center hover:bg-[#1A1A1A]">
              <div className="col-span-3">
                <div className="font-medium text-sm text-[#E8E4DC] truncate">{t.name}</div>
                <div className="text-xs text-[#555]">{t.category} · {t.city}</div>
              </div>
              <div className="col-span-3 text-xs text-[#888] truncate">{t.owner.email}</div>
              <div className="col-span-2">
                <Badge variant={t.plan === "free" ? "secondary" : t.plan === "pro" ? "blue" : "amber"}>
                  {t.plan.toUpperCase()}
                </Badge>
                {t.subscription?.currentPeriodEnd && (
                  <div className="text-xs text-[#555] mt-1">
                    s/d {new Date(t.subscription.currentPeriodEnd).toLocaleDateString("id-ID")}
                  </div>
                )}
              </div>
              <div className="col-span-2 text-sm text-[#E8E4DC]">{t._count.memberships}</div>
              <div className="col-span-2 text-xs text-[#888]">
                {formatDistanceToNow(t.createdAt, { addSuffix: true, locale: id })}
              </div>
            </div>
          ))}
          {tenants.length === 0 && <div className="px-4 py-8 text-center text-[#555] text-sm">Belum ada tenant.</div>}
        </div>
      </main>
    </div>
  )
}
