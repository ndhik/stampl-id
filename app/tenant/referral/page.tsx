import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import ReferralClient from "./referral-client"

export default async function ReferralPage() {
  const session = await auth()
  if (!session?.user?.tenantId) redirect("/tenant/onboarding")

  const tenant = await db.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { id: true, slug: true, name: true },
  })

  const referralLink = `${process.env.NEXT_PUBLIC_TENANT_URL}/auth/register?ref=${tenant?.id}`

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <header className="bg-white border-b border-[#E8E2D8] px-6 py-4">
        <Link href="/dashboard" className="text-xs text-[#888] hover:text-[#1C1C1C]">← Dashboard</Link>
        <h1 className="font-syne font-bold text-xl text-[#1C1C1C] mt-0.5">Referral</h1>
      </header>
      <main className="max-w-md mx-auto px-4 py-8 space-y-4">
        <div className="bg-[#FDF3DC] border border-[#F0D98A] rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🎁</div>
          <h2 className="font-syne font-bold text-[#1C1C1C] text-lg mb-2">Ajak teman, dapat 1 bulan gratis</h2>
          <p className="text-sm text-[#888] leading-relaxed">Setiap bisnis FnB yang kamu referensikan dan berlangganan Pro atau Premium, kamu dapat <strong className="text-[#B8841C]">1 bulan gratis</strong>.</p>
        </div>
        <ReferralClient referralLink={referralLink} />
        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 text-sm text-[#888] space-y-2">
          <p className="font-semibold text-[#1C1C1C]">Cara kerja</p>
          <p>1. Bagikan link referral ke pemilik bisnis FnB lain</p>
          <p>2. Mereka daftar & upgrade ke Pro atau Premium</p>
          <p>3. Kamu otomatis dapat 1 bulan gratis di bulan berikutnya</p>
        </div>
      </main>
    </div>
  )
}
