import { db } from "@/lib/db"
import { formatRupiah } from "@/lib/utils"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function AdminInvoicesPage() {
  const cookieStore = await cookies()
  if (!cookieStore.get("admin-session")) redirect("/auth/login")

  const invoices = await db.invoice.findMany({
    include: { tenant: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E8E4DC]">
      <header className="border-b border-[#1E1E1E] px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="text-[#888] hover:text-[#E8E4DC] text-sm">← Dashboard</Link>
        <h1 className="font-syne font-bold text-xl">Invoices</h1>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-xl overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-4 py-3 text-xs text-[#555] font-syne font-bold uppercase tracking-wide border-b border-[#1E1E1E]">
            <span className="col-span-2">Tenant</span><span>Plan</span><span>Nominal</span><span>Kode</span><span>Status</span>
          </div>
          {invoices.map((inv) => (
            <Link key={inv.id} href={`/invoices/${inv.id}`} className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-[#1A1A1A] hover:bg-[#1A1A1A] items-center">
              <span className="col-span-2 text-sm font-medium text-[#E8E4DC]">{inv.tenant.name}</span>
              <span className="text-sm text-[#888] capitalize">{inv.plan} / {inv.period === "monthly" ? "bln" : "thn"}</span>
              <span className="text-sm font-mono text-[#E8A838]">{formatRupiah(inv.amount + inv.uniqueCode)}</span>
              <span className="text-xs font-mono text-[#AAA]">{inv.transferCode}</span>
              <span>
                <Badge variant={inv.status === "paid" ? "green" : inv.status === "pending" ? "amber" : "destructive"}>
                  {inv.status}
                </Badge>
              </span>
            </Link>
          ))}
          {invoices.length === 0 && <div className="px-4 py-8 text-center text-[#555] text-sm">Belum ada invoice.</div>}
        </div>
      </main>
    </div>
  )
}
