import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

export default async function HomePage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    include: { tenant: { select: { id: true, slug: true, name: true, logoUrl: true, stampCount: true, rewardText: true, themeId: true } } },
    orderBy: { lastStampAt: "desc" },
    take: 6,
  })

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, shortId: true },
  })

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <header className="bg-white border-b border-[#E8E2D8] px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1C1C1C] rounded-md flex items-center justify-center">
            <span className="text-[#E8A838] font-bold text-xs font-syne">St</span>
          </div>
          <span className="font-syne font-bold text-[#1C1C1C]">stample.id</span>
        </div>
        <Link href="/profile" className="w-8 h-8 bg-[#E8A838] rounded-full flex items-center justify-center text-[#1C1C1C] font-bold text-sm">
          {session.user.name?.charAt(0).toUpperCase() || "U"}
        </Link>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="font-syne font-bold text-2xl text-[#1C1C1C]">
            Halo, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-[#888] text-sm mt-1">ID kamu: <span className="font-mono font-medium text-[#1C1C1C]">{user?.shortId?.slice(0, 8).toUpperCase()}</span></p>
        </div>

        {memberships.length === 0 ? (
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">🎫</div>
            <h2 className="font-syne font-bold text-[#1C1C1C] mb-2">Belum ada membership</h2>
            <p className="text-[#888] text-sm">Scan QR di toko favoritmu untuk mulai kumpulkan stamp.</p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-semibold text-[#1C1C1C]">Membership kamu</h2>
              <Link href="/memberships" className="text-sm text-[#888] hover:text-[#1C1C1C]">Lihat semua</Link>
            </div>
            <div className="space-y-3">
              {memberships.map((m: typeof memberships[0]) => {
                const progress = (m.stampsCollected / m.tenant.stampCount) * 100
                const isReady = m.stampsCollected >= m.tenant.stampCount
                return (
                  <Link key={m.id} href={`/${m.tenant.slug}`} className="block bg-white border border-[#E8E2D8] rounded-2xl p-4 hover:border-[#E8A838] transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#F5F2EC] rounded-xl flex items-center justify-center font-bold text-[#1C1C1C] font-syne">
                        {m.tenant.logoUrl ? <img src={m.tenant.logoUrl} alt="" className="w-10 h-10 rounded-xl object-cover" /> : m.tenant.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-[#1C1C1C] truncate">{m.tenant.name}</div>
                        {m.lastStampAt && <div className="text-xs text-[#888]">{formatDistanceToNow(m.lastStampAt, { addSuffix: true, locale: id })}</div>}
                      </div>
                      {isReady && <Badge variant="amber">Reward!</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#F5F2EC] rounded-full h-2">
                        <div className="bg-[#E8A838] h-2 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
                      </div>
                      <span className="text-xs text-[#888] tabular-nums">{m.stampsCollected}/{m.tenant.stampCount}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E2D8] flex">
        {[
          { href: "/home", label: "Home", icon: "🏠" },
          { href: "/memberships", label: "Kartu", icon: "🎫" },
          { href: "/inbox", label: "Inbox", icon: "📬" },
          { href: "/profile", label: "Profil", icon: "👤" },
        ].map(({ href, label, icon }) => (
          <Link key={href} href={href} className="flex-1 flex flex-col items-center py-3 text-[#888] hover:text-[#1C1C1C] text-xs gap-1">
            <span className="text-lg">{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
