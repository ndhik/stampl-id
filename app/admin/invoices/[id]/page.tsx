"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatRupiah } from "@/lib/utils"
import Link from "next/link"

type Invoice = {
  id: string; transferCode: string; plan: string; period: string
  amount: number; uniqueCode: number; status: string; createdAt: string; paidAt?: string
  tenant: { name: string; slug: string; owner: { email: string } }
}

export default function AdminInvoiceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    fetch(`/api/admin/invoice/${id}`).then(r => r.json()).then(setInvoice)
  }, [id])

  async function handleConfirm() {
    if (!confirm("Konfirmasi pembayaran ini? Plan akan langsung diaktifkan dan email dikirim ke UMKM.")) return
    setLoading(true)
    const res = await fetch(`/api/admin/invoice/${id}/confirm`, { method: "POST" })
    if (res.ok) { setConfirmed(true); router.refresh() }
    setLoading(false)
  }

  if (!invoice) return <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center text-[#888]">Memuat...</div>

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-[#E8E4DC] p-4">
      <div className="max-w-md mx-auto pt-8">
        <Link href="/invoices" className="text-[#888] hover:text-[#E8E4DC] text-sm mb-6 block">← Invoices</Link>
        <h1 className="font-syne font-bold text-2xl mb-6">Invoice Detail</h1>

        <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-lg text-[#E8A838]">{invoice.transferCode}</span>
            <Badge variant={invoice.status === "paid" ? "green" : invoice.status === "pending" ? "amber" : "destructive"}>{invoice.status}</Badge>
          </div>
          {[
            ["Tenant", invoice.tenant.name],
            ["Email", invoice.tenant.owner.email],
            ["Plan", `${invoice.plan.toUpperCase()} / ${invoice.period === "monthly" ? "Bulanan" : "Tahunan"}`],
            ["Nominal", formatRupiah(invoice.amount)],
            ["Kode Unik", `+Rp ${invoice.uniqueCode}`],
            ["Total Transfer", formatRupiah(invoice.amount + invoice.uniqueCode)],
            ["Dibuat", new Date(invoice.createdAt).toLocaleString("id-ID")],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm border-b border-[#1A1A1A] pb-2">
              <span className="text-[#555]">{label}</span>
              <span className="text-[#E8E4DC] font-medium">{value}</span>
            </div>
          ))}

          {invoice.status === "pending" && !confirmed && (
            <Button variant="amber" className="w-full mt-4" onClick={handleConfirm} disabled={loading}>
              {loading ? "Memproses..." : "✓ Konfirmasi Pembayaran"}
            </Button>
          )}

          {(invoice.status === "paid" || confirmed) && (
            <div className="bg-[#0A1A0F] border border-[#1A3020] rounded-xl p-4 text-center">
              <p className="text-[#4ADE80] font-semibold">✓ Pembayaran terkonfirmasi</p>
              <p className="text-[#888] text-xs mt-1">Plan telah diaktifkan & email terkirim</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
