import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatRupiah } from "@/lib/utils"

export default async function TenantDashboardPage() {
  const session = await auth()
  if (!session?.user?.tenantId) redirect("/tenant/onboarding")
  if (!session.user.onboardingDone) redirect("/tenant/onboarding")

  const tenantId = session.user.tenantId

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [tenant, totalMembers, activeMembers, stampCount, rewardCount, newMembersWeek] = await Promise.all([
    db.tenant.findUnique({ where: { id: tenantId }, select: { name: true, plan: true, stampCount: true } }),
    db.membership.count({ where: { tenantId } }),
    db.membership.count({ where: { tenantId, lastStampAt: { gte: thirtyDaysAgo } } }),
    db.stampEvent.count({ where: { membership: { tenantId } } }),
    db.rewardClaim.count({ where: { membership: { tenantId } } }),
    db.membership.count({ where: { tenantId, createdAt: { gte: sevenDaysAgo } } }),
  ])

  const dailyStamps = await db.stampEvent.groupBy({
    by: ["createdAt"],
    where: { membership: { tenantId }, createdAt: { gte: thirtyDaysAgo } },
    _count: true,
    orderBy: { createdAt: "asc" },
  })

  const metrics = [
    { label: "Total Member", value: totalMembers, sub: `${newMembersWeek} baru minggu ini`, color: "amber" },
    { label: "Member Aktif (30 hari)", value: activeMembers, sub: "Pernah stamp bulan ini", color: "green" },
    { label: "Total Stamp", value: stampCount, sub: "Sepanjang waktu", color: "blue" },
    { label: "Reward Diklaim", value: rewardCount, sub: "Sepanjang waktu", color: "default" },
  ]

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <header className="bg-white border-b border-[#E8E2D8] px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="font-syne font-bold text-lg text-[#1C1C1C]">{tenant?.name}</h1>
            <Badge variant={tenant?.plan === "free" ? "secondary" : tenant?.plan === "pro" ? "blue" : "amber"}>
              {tenant?.plan?.toUpperCase()}
            </Badge>
          </div>
          <p className="text-xs text-[#888]">Dashboard</p>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/members", label: "Members" },
            { href: "/stamp", label: "Stamp" },
            { href: "/messages", label: "Pesan" },
            { href: "/settings", label: "Pengaturan" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} className="px-3 py-1.5 text-sm text-[#888] hover:text-[#1C1C1C] rounded-lg hover:bg-[#F5F2EC]">{label}</Link>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {metrics.map(({ label, value, sub }) => (
            <Card key={label}>
              <CardContent className="p-4">
                <p className="text-xs text-[#888] mb-1">{label}</p>
                <p className="font-syne font-bold text-2xl text-[#1C1C1C]">{value.toLocaleString("id-ID")}</p>
                <p className="text-xs text-[#888] mt-1">{sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader><CardTitle className="text-sm">Aktivitas 30 Hari Terakhir</CardTitle></CardHeader>
            <CardContent>
              {dailyStamps.length === 0 ? (
                <div className="text-center py-8 text-[#888] text-sm">Belum ada stamp tercatat.</div>
              ) : (
                <div className="flex items-end gap-1 h-24">
                  {dailyStamps.map((d, i) => (
                    <div key={i} className="flex-1 bg-[#E8A838] rounded-sm opacity-80 hover:opacity-100"
                      style={{ height: `${Math.max(10, (d._count / Math.max(...dailyStamps.map(x => x._count))) * 100)}%` }}
                      title={`${d._count} stamp`} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-[#888] mb-3 font-semibold uppercase tracking-wide">Quick Actions</p>
                <div className="space-y-2">
                  {[
                    { href: "/stamp", label: "📷 Scan Stamp", desc: "Tambah stamp pelanggan" },
                    { href: "/members", label: "👥 Lihat Members", desc: "Kelola member" },
                    { href: "/messages", label: "📣 Kirim Pesan", desc: "Blast ke semua member" },
                    { href: "/settings/qr", label: "📄 Download QR", desc: "Print ulang QR code" },
                  ].map(({ href, label, desc }) => (
                    <Link key={href} href={href} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#F5F2EC] group">
                      <div>
                        <div className="text-sm font-medium text-[#1C1C1C]">{label}</div>
                        <div className="text-xs text-[#888]">{desc}</div>
                      </div>
                      <span className="text-[#CCC] group-hover:text-[#888]">›</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
