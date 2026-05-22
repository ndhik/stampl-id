import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function MembershipsPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    include: { tenant: { select: { id: true, slug: true, name: true, logoUrl: true, stampCount: true, rewardText: true, category: true, city: true } } },
    orderBy: { lastStampAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-[#F5F2EC] pb-20">
      <header className="bg-white border-b border-[#E8E2D8] px-4 py-4">
        <h1 className="font-syne font-bold text-xl text-[#1C1C1C]">Membership Kamu</h1>
        <p className="text-xs text-[#888] mt-0.5">{memberships.length} brand</p>
      </header>
      <main className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {memberships.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🎫</div>
            <h2 className="font-syne font-bold text-[#1C1C1C] mb-2">Belum ada membership</h2>
            <p className="text-[#888] text-sm">Scan QR di toko favoritmu untuk mulai.</p>
          </div>
        ) : (
          memberships.map((m) => {
            const isReady = m.stampsCollected >= m.tenant.stampCount
            const progress = Math.min((m.stampsCollected / m.tenant.stampCount) * 100, 100)
            return (
              <Link key={m.id} href={`/${m.tenant.slug}`} className="block bg-white border border-[#E8E2D8] rounded-2xl p-5 hover:border-[#E8A838] transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#F5F2EC] rounded-xl flex items-center justify-center font-bold text-[#1C1C1C] font-syne text-lg overflow-hidden flex-shrink-0">
                    {m.tenant.logoUrl ? <img src={m.tenant.logoUrl} alt="" className="w-full h-full object-cover" /> : m.tenant.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-syne font-bold text-[#1C1C1C] truncate">{m.tenant.name}</span>
                      {isReady && <Badge variant="amber">Reward!</Badge>}
                    </div>
                    <span className="text-xs text-[#888]">{m.tenant.category} · {m.tenant.city}</span>
                  </div>
                  <span className="text-[#888] text-lg">›</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 mb-3">
                  {Array.from({ length: Math.min(m.tenant.stampCount, 10) }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-sm border ${i < m.stampsCollected ? "bg-[#1C1C1C] border-[#1C1C1C]" : "bg-[#F5F2EC] border-[#E8E2D8]"}`}>
                      {i < m.stampsCollected ? "⭐" : ""}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#F5F2EC] rounded-full h-1.5">
                    <div className="bg-[#E8A838] h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs text-[#888] tabular-nums">{m.stampsCollected}/{m.tenant.stampCount}</span>
                </div>
                <p className="text-xs text-[#888] mt-2">Reward: {m.tenant.rewardText}</p>
              </Link>
            )
          })
        )}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2D8] flex">
        {[{ href: "/home", label: "Home", icon: "🏠" }, { href: "/memberships", label: "Kartu", icon: "🎫" }, { href: "/inbox", label: "Inbox", icon: "📬" }, { href: "/profile", label: "Profil", icon: "👤" }].map(({ href, label, icon }) => (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center py-3 text-[#888] hover:text-[#1C1C1C] text-xs gap-1">
            <span className="text-lg">{icon}</span>{label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
