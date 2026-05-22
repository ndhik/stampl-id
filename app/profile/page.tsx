import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, shortId: true, createdAt: true, _count: { select: { memberships: true } } },
  })

  return (
    <div className="min-h-screen bg-[#F5F2EC] pb-20">
      <header className="bg-white border-b border-[#E8E2D8] px-4 py-4">
        <h1 className="font-syne font-bold text-xl text-[#1C1C1C]">Profil</h1>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-16 h-16 bg-[#E8A838] rounded-full flex items-center justify-center text-[#1C1C1C] font-bold font-syne text-2xl">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-syne font-bold text-lg text-[#1C1C1C]">{user?.name}</div>
            <div className="text-sm text-[#888]">{user?.email}</div>
          </div>
        </div>

        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 space-y-3">
          <h2 className="font-syne font-semibold text-sm text-[#1C1C1C]">Info Akun</h2>
          {[
            ["Short ID", <span className="font-mono font-bold text-[#E8A838]">{user?.shortId?.slice(0, 8).toUpperCase()}</span>],
            ["Membership", `${user?._count.memberships} brand`],
            ["Bergabung", user?.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex justify-between items-center text-sm border-b border-[#F5F2EC] pb-2">
              <span className="text-[#888]">{label}</span>
              <span className="font-medium text-[#1C1C1C]">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-[#FDF3DC] border border-[#F0D98A] rounded-2xl p-4 text-sm text-[#B8841C]">
          <p className="font-semibold mb-1">💡 Apa itu Short ID?</p>
          <p className="text-xs leading-relaxed">Short ID adalah identitas unikmu di stample.id. Sebutkan ke kasir saat kamu tidak bisa menunjukkan QR untuk mendapatkan stamp secara manual.</p>
        </div>

        <form action={async () => { "use server"; await signOut({ redirectTo: "/" }) }}>
          <Button type="submit" variant="outline" className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600">
            Keluar
          </Button>
        </form>
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
