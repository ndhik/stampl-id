import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import QrDownloadClient from "./qr-client"

export default async function QrPage() {
  const session = await auth()
  if (!session?.user?.tenantId) redirect("/tenant/onboarding")

  const tenant = await db.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { slug: true, name: true },
  })
  if (!tenant) redirect("/tenant/dashboard")

  const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${tenant.slug}`

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <header className="bg-white border-b border-[#E8E2D8] px-6 py-4">
        <Link href="/settings" className="text-xs text-[#888] hover:text-[#1C1C1C]">← Pengaturan</Link>
        <h1 className="font-syne font-bold text-xl text-[#1C1C1C] mt-0.5">QR Code</h1>
      </header>
      <main className="max-w-md mx-auto px-4 py-8">
        <QrDownloadClient tenantName={tenant.name} profileUrl={profileUrl} />
      </main>
    </div>
  )
}
