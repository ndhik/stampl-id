import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

export default async function MembersPage() {
  const session = await auth()
  if (!session?.user?.tenantId) redirect("/tenant/onboarding")

  const members = await db.membership.findMany({
    where: { tenantId: session.user.tenantId },
    include: { tenant: { select: { stampCount: true } }, user: { select: { name: true, email: true, shortId: true } } },
    orderBy: { lastStampAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <header className="bg-white border-b border-[#E8E2D8] px-6 py-4 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-xs text-[#888] hover:text-[#1C1C1C]">← Dashboard</Link>
          <h1 className="font-syne font-bold text-xl text-[#1C1C1C] mt-0.5">Members</h1>
        </div>
        <span className="text-sm text-[#888]">{members.length} total</span>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-6">
        {members.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👥</div>
            <h2 className="font-syne font-bold text-[#1C1C1C] mb-2">Belum ada member</h2>
            <p className="text-[#888] text-sm">Bagikan QR code ke pelanggan pertamamu.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#E8E2D8] rounded-2xl overflow-hidden">
            {members.map((m, i) => {
              const isReady = m.stampsCollected >= m.tenant.stampCount
              return (
                <div key={m.id} className={`flex items-center gap-4 px-5 py-4 ${i < members.length - 1 ? "border-b border-[#F5F2EC]" : ""}`}>
                  <div className="w-9 h-9 bg-[#F5F2EC] rounded-full flex items-center justify-center font-bold text-[#1C1C1C] font-syne flex-shrink-0">
                    {m.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm text-[#1C1C1C] truncate">{m.user.name || "Tanpa nama"}</span>
                      {isReady && <Badge variant="amber" className="text-xs">Reward ready</Badge>}
                    </div>
                    <span className="font-mono text-xs text-[#888]">{m.user.shortId?.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-[#1C1C1C]">{m.stampsCollected}/{m.tenant.stampCount}</div>
                    {m.lastStampAt && <div className="text-xs text-[#888]">{formatDistanceToNow(m.lastStampAt, { addSuffix: true, locale: id })}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
