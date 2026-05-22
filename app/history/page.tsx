import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const claims = await db.rewardClaim.findMany({
    where: { membership: { userId: session.user.id } },
    include: { membership: { include: { tenant: { select: { name: true, slug: true, rewardText: true, logoUrl: true } } } } },
    orderBy: { claimedAt: "desc" },
    take: 30,
  })

  return (
    <div className="min-h-screen bg-[#F5F2EC] pb-20">
      <header className="bg-white border-b border-[#E8E2D8] px-4 py-4">
        <h1 className="font-syne font-bold text-xl text-[#1C1C1C]">Riwayat Reward</h1>
      </header>
      <main className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {claims.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="font-syne font-bold text-[#1C1C1C] mb-2">Belum ada reward diklaim</h2>
            <p className="text-[#888] text-sm">Kumpulkan stamp dan klaim reward pertamamu!</p>
          </div>
        ) : (
          claims.map((c) => (
            <Link key={c.id} href={`/${c.membership.tenant.slug}`} className="flex items-center gap-3 bg-white border border-[#E8E2D8] rounded-xl p-4 hover:border-[#E8A838] transition-colors">
              <div className="w-10 h-10 bg-[#FDF3DC] rounded-lg flex items-center justify-center text-lg overflow-hidden flex-shrink-0">
                {c.membership.tenant.logoUrl ? <img src={c.membership.tenant.logoUrl} alt="" className="w-full h-full object-cover rounded-lg" /> : "🏆"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[#1C1C1C] truncate">{c.membership.tenant.name}</div>
                <div className="text-xs text-[#888]">{c.membership.tenant.rewardText}</div>
              </div>
              <div className="text-xs text-[#888] text-right flex-shrink-0">
                {formatDistanceToNow(c.claimedAt, { addSuffix: true, locale: id })}
              </div>
            </Link>
          ))
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
