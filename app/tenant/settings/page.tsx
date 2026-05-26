import { auth } from "@/lib/auth-tenant"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user?.tenantId) redirect("/tenant/onboarding")

  const tenant = await db.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { name: true, category: true, city: true, description: true, stampCount: true, rewardText: true, validityMonths: true, welcomingReward: true, welcomingText: true, themeId: true, stampDesignId: true, plan: true, dailyLimit: true },
  })

  const sections = [
    { href: "/settings/business", label: "Detail Bisnis", desc: `${tenant?.name} · ${tenant?.category} · ${tenant?.city}`, icon: "🏪" },
    { href: "/settings/policy", label: "Stamp Policy", desc: `${tenant?.stampCount} stamp → ${tenant?.rewardText}`, icon: "⚙️" },
    { href: "/settings/appearance", label: "Tampilan", desc: `Theme: ${tenant?.themeId} · Design: ${tenant?.stampDesignId}`, icon: "🎨" },
    { href: "/settings/qr", label: "QR Code", desc: "Download dan print QR code", icon: "📄" },
  ]

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <header className="bg-white border-b border-[#E8E2D8] px-6 py-4">
        <Link href="/dashboard" className="text-xs text-[#888] hover:text-[#1C1C1C]">← Dashboard</Link>
        <h1 className="font-syne font-bold text-xl text-[#1C1C1C] mt-0.5">Pengaturan</h1>
      </header>
      <main className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-white border border-[#E8E2D8] rounded-2xl overflow-hidden mb-4">
          {sections.map(({ href, label, desc, icon }, i) => (
            <Link key={href} href={href} className={`flex items-center gap-4 px-5 py-4 hover:bg-[#F5F2EC] transition-colors ${i < sections.length - 1 ? "border-b border-[#F5F2EC]" : ""}`}>
              <span className="text-xl w-8">{icon}</span>
              <div className="flex-1">
                <div className="font-medium text-sm text-[#1C1C1C]">{label}</div>
                <div className="text-xs text-[#888] truncate">{desc}</div>
              </div>
              <span className="text-[#CCC]">›</span>
            </Link>
          ))}
        </div>
        <Link href="/billing" className="flex items-center gap-4 px-5 py-4 bg-[#FDF3DC] border border-[#F0D98A] rounded-2xl hover:bg-[#FAE9C0] transition-colors">
          <span className="text-xl">⚡</span>
          <div className="flex-1">
            <div className="font-semibold text-sm text-[#B8841C]">Upgrade Plan</div>
            <div className="text-xs text-[#888]">Plan saat ini: {tenant?.plan?.toUpperCase()}</div>
          </div>
          <span className="text-[#E8A838]">›</span>
        </Link>
      </main>
    </div>
  )
}
