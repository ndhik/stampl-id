"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

type StampResult = { memberName: string; stampsCollected: number; stampCount: number; isRewardReady: boolean; membershipId?: string }

export default function StampPage() {
  const [tab, setTab] = useState<"scan" | "manual">("scan")
  const [shortId, setShortId] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StampResult | null>(null)
  const [error, setError] = useState("")
  const [claimed, setClaimed] = useState(false)

  async function handleManualStamp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResult(null)
    setClaimed(false)
    const res = await fetch("/api/stamp/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shortId: shortId.toUpperCase() }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setResult(data)
    setLoading(false)
    setShortId("")
  }

  async function handleClaim() {
    if (!result?.membershipId) return
    setLoading(true)
    await fetch("/api/reward/claim", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ membershipId: result.membershipId }),
    })
    setClaimed(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] p-4">
      <div className="max-w-md mx-auto">
        <h1 className="font-syne font-bold text-2xl text-[#1C1C1C] mb-6">Stamp</h1>

        <div className="flex bg-white border border-[#E8E2D8] rounded-xl p-1 mb-6">
          {[{ id: "scan", label: "📷 Scan QR" }, { id: "manual", label: "⌨️ Manual (Short ID)" }].map(({ id, label }) => (
            <button key={id} onClick={() => { setTab(id as any); setResult(null); setError("") }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${tab === id ? "bg-[#1C1C1C] text-[#E8A838]" : "text-[#888]"}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === "scan" && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-48 h-48 bg-[#F5F2EC] border-2 border-dashed border-[#E8E2D8] rounded-xl mx-auto flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-xs text-[#888]">Kamera akan aktif di sini</p>
                </div>
              </div>
              <p className="text-sm text-[#888] mb-4">Arahkan kamera ke QR code pelanggan</p>
              <Button variant="amber" className="w-full">Aktifkan Kamera</Button>
              <p className="text-xs text-[#888] mt-3">QR scan akan tersedia setelah deployment dengan HTTPS</p>
            </CardContent>
          </Card>
        )}

        {tab === "manual" && (
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleManualStamp} className="space-y-4">
                <div>
                  <Label>Short ID Pelanggan</Label>
                  <Input value={shortId} onChange={e => setShortId(e.target.value)} className="mt-1 font-mono uppercase" placeholder="Misal: ABC12345" required />
                  <p className="text-xs text-[#888] mt-1">Minta pelanggan sebutkan Short ID dari halaman stamp card mereka</p>
                </div>
                <Button type="submit" variant="amber" className="w-full" disabled={loading}>
                  {loading ? "Mencari..." : "Cari & Tambah Stamp"}
                </Button>
              </form>

              {error && <div className="mt-4 bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg">{error}</div>}

              {result && !claimed && (
                <div className="mt-4 bg-[#E6F4EA] border border-[#A8D5B5] rounded-xl p-4">
                  <p className="font-semibold text-[#2D7D46] mb-1">✓ Stamp ditambahkan!</p>
                  <p className="text-sm text-[#1C1C1C]">{result.memberName}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 bg-white rounded-full h-2">
                      <div className="bg-[#E8A838] h-2 rounded-full" style={{ width: `${(result.stampsCollected / result.stampCount) * 100}%` }} />
                    </div>
                    <span className="text-xs text-[#888]">{result.stampsCollected}/{result.stampCount}</span>
                  </div>
                  {result.isRewardReady && (
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-[#B8841C] mb-2">🏆 Stamp penuh! Klaim reward?</p>
                      <Button variant="amber" size="sm" onClick={handleClaim} disabled={loading}>Konfirmasi Klaim Reward</Button>
                    </div>
                  )}
                </div>
              )}

              {claimed && (
                <div className="mt-4 bg-[#FDF3DC] border border-[#F0D98A] rounded-xl p-4 text-center">
                  <p className="font-semibold text-[#B8841C]">✓ Reward berhasil diklaim!</p>
                  <p className="text-sm text-[#888] mt-1">Stamp card telah direset ke 0.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
