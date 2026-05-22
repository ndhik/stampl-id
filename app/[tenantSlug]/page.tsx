import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function TenantProfilePage({ params }: { params: { tenantSlug: string } }) {
  const tenant = await db.tenant.findUnique({
    where: { slug: params.tenantSlug, isActive: true },
  })
  if (!tenant) notFound()

  const session = await auth()
  let membership = null
  if (session?.user?.id) {
    membership = await db.membership.findUnique({
      where: { userId_tenantId: { userId: session.user.id, tenantId: tenant.id } },
    })
  }

  const isReady = membership && membership.stampsCollected >= tenant.stampCount

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-[#1C1C1C] text-white px-6 pt-12 pb-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#E8A838] rounded-2xl flex items-center justify-center text-3xl font-bold font-syne text-[#1C1C1C] overflow-hidden">
            {tenant.logoUrl ? <img src={tenant.logoUrl} alt={tenant.name} className="w-full h-full object-cover" /> : tenant.name.charAt(0)}
          </div>
          <h1 className="font-syne font-bold text-2xl mb-1">{tenant.name}</h1>
          <p className="text-[#888] text-sm">{tenant.category} · {tenant.city}</p>
          {tenant.description && <p className="text-[#AAA] text-sm mt-3">{tenant.description}</p>}
        </div>

        <div className="px-4 py-6 space-y-4">
          {/* Stamp card */}
          <div className="bg-white border border-[#E8E2D8] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-syne font-semibold text-[#1C1C1C]">Stamp Card</h2>
              {isReady && <Badge variant="amber">🎉 Reward siap diklaim!</Badge>}
            </div>

            {membership ? (
              <>
                <div className="grid grid-cols-5 gap-2 mb-4">
                  {Array.from({ length: tenant.stampCount }).map((_, i) => (
                    <div key={i} className={`aspect-square rounded-xl flex items-center justify-center text-lg border-2 ${i < membership.stampsCollected ? "bg-[#1C1C1C] border-[#1C1C1C]" : "bg-[#F5F2EC] border-[#E8E2D8]"}`}>
                      {i < membership.stampsCollected ? "⭐" : ""}
                    </div>
                  ))}
                </div>
                <div className="bg-[#F5F2EC] rounded-xl p-3 flex items-center justify-between">
                  <span className="text-sm text-[#888]">Short ID kamu</span>
                  <span className="font-mono font-bold text-[#1C1C1C] text-sm">
                    {session?.user?.id?.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                {isReady && (
                  <div className="mt-4 p-4 bg-[#FDF3DC] border border-[#F0D98A] rounded-xl text-center">
                    <div className="text-2xl mb-2">🏆</div>
                    <p className="font-semibold text-[#B8841C]">Selamat! Kamu dapat:</p>
                    <p className="text-[#1C1C1C] font-bold mt-1">{tenant.rewardText}</p>
                    <p className="text-xs text-[#888] mt-2">Tunjukkan halaman ini ke kasir untuk klaim reward</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-3xl mb-3">🎫</div>
                <p className="text-[#888] text-sm mb-4">
                  Kumpulkan <strong className="text-[#1C1C1C]">{tenant.stampCount} stamp</strong> dan dapatkan{" "}
                  <strong className="text-[#1C1C1C]">{tenant.rewardText}</strong>
                </p>
                {tenant.welcomingReward && (
                  <div className="bg-[#E6F4EA] border border-[#A8D5B5] rounded-xl p-3 text-sm text-[#2D7D46] mb-4">
                    🎁 Dapatkan <strong>{tenant.welcomingText}</strong> untuk member baru!
                  </div>
                )}
                {session?.user ? (
                  <form action={`/api/membership/join`} method="POST">
                    <input type="hidden" name="tenantId" value={tenant.id} />
                    <Button variant="amber" className="w-full">Gabung & Mulai Kumpulkan Stamp</Button>
                  </form>
                ) : (
                  <Button variant="amber" className="w-full" asChild>
                    <Link href={`/auth/login?callbackUrl=/${tenant.slug}`}>Login untuk Gabung</Link>
                  </Button>
                )}
              </div>
            )}
          </div>

          {membership && (
            <Button variant="outline" className="w-full" asChild>
              <Link href="/home">Lihat Semua Membership</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
