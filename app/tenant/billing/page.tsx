"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah, getPlanPrice } from "@/lib/utils"

type InvoiceData = {
  id: string; transferCode: string; amount: number; uniqueCode: number
  totalAmount: number; bankName: string; bankAccountNumber: string
  bankAccountName: string; whatsappNumber: string; expiresAt: string
}

export default function BillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "premium">("pro")
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "yearly">("monthly")
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)
  const [loading, setLoading] = useState(false)

  const plans = [
    { id: "pro", name: "Pro", features: ["10+ page theme", "10+ stamp design", "Analitik lanjutan", "Semua fitur Free"] },
    { id: "premium", name: "Premium", features: ["Custom page theme", "Custom stamp design", "Upload foto reward", "Semua fitur Pro", "Priority support"] },
  ]

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch("/api/invoice/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: selectedPlan, period: selectedPeriod }),
    })
    const data = await res.json()
    if (res.ok) setInvoice(data)
    setLoading(false)
  }

  if (invoice) {
    return (
      <div className="min-h-screen bg-[#F5F2EC] p-4">
        <div className="max-w-md mx-auto">
          <h1 className="font-syne font-bold text-2xl text-[#1C1C1C] mb-6">Invoice Pembayaran</h1>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-3xl mb-2">🧾</div>
                <p className="font-mono font-bold text-lg text-[#1C1C1C]">{invoice.transferCode}</p>
                <p className="text-xs text-[#888] mt-1">Gunakan kode ini sebagai berita acara transfer</p>
              </div>
              <div className="bg-[#FDF3DC] border border-[#F0D98A] rounded-xl p-4 text-center">
                <p className="text-xs text-[#888] mb-1">Total transfer</p>
                <p className="font-syne font-bold text-3xl text-[#1C1C1C]">{formatRupiah(invoice.totalAmount)}</p>
                <p className="text-xs text-[#888] mt-1">Termasuk kode unik Rp {invoice.uniqueCode}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#888]">Bank</span><span className="font-medium">{invoice.bankName}</span></div>
                <div className="flex justify-between"><span className="text-[#888]">No. Rekening</span><span className="font-mono font-medium">{invoice.bankAccountNumber}</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Atas Nama</span><span className="font-medium">{invoice.bankAccountName}</span></div>
              </div>
              <div className="bg-[#E8F0FB] border border-[#BDD0F5] rounded-xl p-4 text-sm">
                <p className="font-semibold text-[#1E5BA8] mb-1">Setelah transfer:</p>
                <p className="text-[#444]">Konfirmasi ke WhatsApp <strong>{invoice.whatsappNumber}</strong> dengan menyebutkan kode <strong>{invoice.transferCode}</strong>. Plan akan diaktifkan dalam 1×24 jam.</p>
              </div>
              <p className="text-xs text-[#888] text-center">Invoice berlaku sampai {new Date(invoice.expiresAt).toLocaleDateString("id-ID")}</p>
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full mt-4" onClick={() => setInvoice(null)}>Kembali</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] p-4">
      <div className="max-w-md mx-auto">
        <h1 className="font-syne font-bold text-2xl text-[#1C1C1C] mb-2">Upgrade Plan</h1>
        <p className="text-[#888] text-sm mb-6">Tidak ada biaya tersembunyi. Pembayaran via transfer bank.</p>

        <div className="flex bg-white border border-[#E8E2D8] rounded-xl p-1 mb-6">
          {[{ id: "monthly", label: "Bulanan" }, { id: "yearly", label: "Tahunan (hemat 15%)" }].map(({ id, label }) => (
            <button key={id} onClick={() => setSelectedPeriod(id as any)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${selectedPeriod === id ? "bg-[#1C1C1C] text-[#E8A838]" : "text-[#888]"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          {plans.map(({ id, name, features }) => (
            <div key={id} onClick={() => setSelectedPlan(id as any)}
              className={`bg-white border-2 rounded-2xl p-5 cursor-pointer transition-colors ${selectedPlan === id ? "border-[#E8A838]" : "border-[#E8E2D8]"}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-syne font-bold text-lg text-[#1C1C1C]">{name}</div>
                  <div className="font-syne font-bold text-2xl text-[#E8A838]">
                    {formatRupiah(getPlanPrice(id, selectedPeriod))}
                    <span className="text-sm font-normal text-[#888]">/{selectedPeriod === "monthly" ? "bulan" : "tahun"}</span>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === id ? "border-[#E8A838] bg-[#E8A838]" : "border-[#E8E2D8]"}`}>
                  {selectedPlan === id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </div>
              <ul className="space-y-1">
                {features.map(f => <li key={f} className="text-sm text-[#666] flex items-center gap-2"><span className="text-[#E8A838]">✓</span>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <Button variant="amber" className="w-full" size="lg" onClick={handleUpgrade} disabled={loading}>
          {loading ? "Memproses..." : `Upgrade ke ${selectedPlan.toUpperCase()}`}
        </Button>
      </div>
    </div>
  )
}
