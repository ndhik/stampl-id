import { db } from "@/lib/db"
import { formatRupiah } from "@/lib/utils"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  if (!cookieStore.get("admin-session")) redirect("/auth/login")

  const [tenants, users, stamps, pendingInvoices, recentInvoices] = await Promise.all([
    db.tenant.count({ where: { isActive: true } }),
    db.user.count(),
    db.stampEvent.count(),
    db.invoice.count({ where: { status: "pending" } }),
    db.invoice.findMany({
      where: { status: "paid", paidAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      select: { amount: true, uniqueCode: true },
    }),
  ])

  const mrr = recentInvoices.reduce((s: number, i: { amount: number; uniqueCode: number }) => s + i.amount + i.uniqueCode, 0)

  const metrics = [
    { label: "Tenant Aktif", value: tenants },
    { label: "Total User", value: users },
    { label: "Total Stamp", value: stamps },
    { label: "Invoice Pending", value: pendingInvoices, highlight: pendingInvoices > 0 },
    { label: "Revenue Bulan Ini", value: formatRupiah(mrr), isText: true },
  ]

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E8E4DC]">
      <header className="border-b border-[#1E1E1E] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E8A838] rounded-lg flex items-center justify-center">
            <span className="font-syne font-bold text-[#0F0F0F] text-sm">St</span>
          </div>
          <span className="font-syne font-bold">Admin Panel</span>
        </div>
        <nav className="flex gap-1">
          {[{ href: "/dashboard", label: "Dashboard" }, { href: "/tenants", label: "Tenants" }, { href: "/invoices", label: "Invoices" }].map(({ href, label }) => (
            <Link key={href} href={href} className="px-3 py-1.5 text-sm text-[#888] hover:text-[#E8E4DC] rounded-lg hover:bg-[#1A1A1A]">{label}</Link>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-syne font-bold text-2xl mb-6">Overview</h1>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {metrics.map(({ label, value, highlight, isText }) => (
            <div key={label} className={`bg-[#141414] border rounded-xl p-4 ${highlight ? "border-[#E8A838]" : "border-[#1E1E1E]"}`}>
              <p className="text-xs text-[#555] mb-1">{label}</p>
              <p className={`font-syne font-bold ${isText ? "text-lg" : "text-2xl"} ${highlight ? "text-[#E8A838]" : "text-[#E8E4DC]"}`}>
                {isText ? value : typeof value === "number" ? value.toLocaleString("id-ID") : value}
              </p>
            </div>
          ))}
        </div>

        {pendingInvoices > 0 && (
          <div className="bg-[#1A1200] border border-[#2A2000] rounded-xl p-4 mb-6">
            <p className="text-[#E8A838] font-semibold mb-1">⚡ Ada {pendingInvoices} invoice menunggu konfirmasi</p>
            <p className="text-[#888] text-sm">Cek dan konfirmasi pembayaran dari UMKM.</p>
            <Link href="/invoices" className="text-sm text-[#E8A838] hover:underline mt-2 inline-block">Lihat Invoices →</Link>
          </div>
        )}
      </main>
    </div>
  )
}
