import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"

export default async function LandingPage() {
  const session = await auth()
  if (session?.user) redirect("/home")

  const tenantCount = await db.tenant.count({ where: { isActive: true } }).catch(() => 0)

  return (
    <main className="min-h-screen bg-[#F5F2EC] flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#1C1C1C] rounded-lg flex items-center justify-center">
            <span className="text-[#E8A838] font-bold text-sm font-syne">St</span>
          </div>
          <span className="font-bold text-[#1C1C1C] font-syne text-lg">stample.id</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/auth/login">Masuk</Link>
          </Button>
        </div>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-[#FDF3DC] text-[#B8841C] text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-[#E8A838] rounded-full" />
          {tenantCount > 0 ? `${tenantCount} bisnis sudah bergabung` : "Segera hadir"}
        </div>
        <h1 className="font-syne font-extrabold text-4xl md:text-6xl text-[#1C1C1C] leading-tight mb-6 max-w-3xl">
          Stamp card fisik sudah ketinggalan zaman
        </h1>
        <p className="text-[#666] text-lg mb-10 max-w-xl leading-relaxed">
          Ganti stamp card kertas dengan stample.id. Pelanggan cukup scan QR, tanpa download app. Kamu dapat data, pelanggan dapat reward.
        </p>
        <div className="flex items-center gap-3">
          <Button variant="amber" size="lg" asChild>
            <Link href="/auth/login">Mulai Gratis</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="#how-it-works">Cara Kerja</Link>
          </Button>
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-6 max-w-5xl mx-auto w-full">
        <h2 className="font-syne font-bold text-2xl text-center text-[#1C1C1C] mb-12">Setup dalam 15 menit</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Daftar & Setup", desc: "Isi detail bisnis, pilih tema halaman dan desain stamp, atur reward." },
            { step: "02", title: "Print QR Code", desc: "Download QR code dan tempel di kasir. Pelanggan scan untuk mulai kumpulkan stamp." },
            { step: "03", title: "Pantau & Grow", desc: "Lihat siapa member loyal kamu, berapa stamp yang terkumpul, dan kirim promo." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="bg-white border border-[#E8E2D8] rounded-xl p-6">
              <div className="font-syne font-extrabold text-3xl text-[#E8A838] mb-4">{step}</div>
              <h3 className="font-syne font-bold text-[#1C1C1C] mb-2">{title}</h3>
              <p className="text-[#888] text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#E8E2D8] py-8 px-6 text-center text-[#888] text-sm">
        <p>© 2025 stample.id</p>
      </footer>
    </main>
  )
}
