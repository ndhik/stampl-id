import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import Link from "next/link"

export default async function InboxPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    select: { tenantId: true },
  })
  const tenantIds = memberships.map(m => m.tenantId)

  const messages = await db.message.findMany({
    where: { tenantId: { in: tenantIds } },
    include: { tenant: { select: { name: true, slug: true } } },
    orderBy: { sentAt: "desc" },
    take: 30,
  })

  return (
    <div className="min-h-screen bg-[#F5F2EC] pb-20">
      <header className="bg-white border-b border-[#E8E2D8] px-4 py-4">
        <h1 className="font-syne font-bold text-xl text-[#1C1C1C]">Inbox</h1>
      </header>
      <main className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {messages.map(m => (
          <Card key={m.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Link href={`/${m.tenant.slug}`} className="text-xs font-semibold text-[#E8A838] hover:underline">{m.tenant.name}</Link>
                <span className="text-xs text-[#888]">· {formatDistanceToNow(m.sentAt, { addSuffix: true, locale: id })}</span>
              </div>
              <p className="text-sm text-[#1C1C1C]">{m.content}</p>
            </CardContent>
          </Card>
        ))}
        {messages.length === 0 && (
          <div className="text-center py-12 text-[#888] text-sm">Belum ada pesan dari brand yang kamu ikuti.</div>
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
