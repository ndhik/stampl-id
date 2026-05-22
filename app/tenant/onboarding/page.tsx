"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slugify } from "@/lib/utils"

const THEMES = [
  { id: "default", name: "Classic", color: "#1C1C1C" },
  { id: "warm", name: "Warm", color: "#E8A838" },
  { id: "forest", name: "Forest", color: "#2D7D46" },
]
const DESIGNS = [
  { id: "classic", name: "Classic Star", emoji: "⭐" },
  { id: "coffee", name: "Coffee", emoji: "☕" },
  { id: "heart", name: "Heart", emoji: "❤️" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", category: "Kafe", city: "",
    stampCount: 10, rewardText: "1 item gratis",
    validityMonths: 12, welcomingReward: false, welcomingText: "",
    themeId: "default", stampDesignId: "classic",
  })

  const CATEGORIES = ["Kafe", "Restoran", "Bakery", "Minuman", "Dessert", "Lainnya"]

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch("/api/tenant/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, slug: slugify(form.name) }),
    })
    if (res.ok) router.push("/dashboard")
    else setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-[#1C1C1C] rounded-lg flex items-center justify-center">
            <span className="text-[#E8A838] font-bold font-syne text-sm">St</span>
          </div>
          <span className="font-syne font-bold text-[#1C1C1C]">stample.id</span>
        </div>

        <div className="flex gap-1 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`flex-1 h-1.5 rounded-full ${s <= step ? "bg-[#E8A838]" : "bg-[#E8E2D8]"}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="font-syne font-bold text-2xl text-[#1C1C1C]">Detail Bisnis</h1>
            <div><Label>Nama Bisnis</Label><Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1" placeholder="Nama kafe atau restoran" /></div>
            <div>
              <Label>Kategori</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setForm({...form, category: c})}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${form.category === c ? "bg-[#1C1C1C] text-[#E8A838] border-[#1C1C1C]" : "bg-white border-[#E8E2D8] text-[#888]"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div><Label>Kota</Label><Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="mt-1" placeholder="Jakarta, Bandung, ..." /></div>
            <Button variant="amber" className="w-full" onClick={() => setStep(2)} disabled={!form.name || !form.city}>Lanjut</Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h1 className="font-syne font-bold text-2xl text-[#1C1C1C]">Atur Stamp Policy</h1>
            <div>
              <Label>Jumlah Stamp untuk 1 Reward</Label>
              <div className="flex items-center gap-3 mt-2">
                <button onClick={() => setForm({...form, stampCount: Math.max(5, form.stampCount - 1)})} className="w-9 h-9 rounded-lg bg-[#F5F2EC] border border-[#E8E2D8] font-bold">-</button>
                <span className="font-syne font-bold text-2xl text-[#1C1C1C] w-8 text-center">{form.stampCount}</span>
                <button onClick={() => setForm({...form, stampCount: Math.min(20, form.stampCount + 1)})} className="w-9 h-9 rounded-lg bg-[#F5F2EC] border border-[#E8E2D8] font-bold">+</button>
              </div>
            </div>
            <div><Label>Deskripsi Reward</Label><Input value={form.rewardText} onChange={e => setForm({...form, rewardText: e.target.value})} className="mt-1" placeholder="1 kopi gratis, 1 menu pilihan, ..." /></div>
            <div>
              <Label>Validity Period (bulan)</Label>
              <Input type="number" value={form.validityMonths} onChange={e => setForm({...form, validityMonths: parseInt(e.target.value)})} className="mt-1" min={1} max={24} />
            </div>
            <div className="flex items-center gap-3 p-4 bg-white border border-[#E8E2D8] rounded-xl">
              <input type="checkbox" id="welcoming" checked={form.welcomingReward} onChange={e => setForm({...form, welcomingReward: e.target.checked})} className="w-4 h-4 accent-[#E8A838]" />
              <label htmlFor="welcoming" className="text-sm font-medium">Aktifkan welcoming reward untuk member baru</label>
            </div>
            {form.welcomingReward && (
              <div><Label>Deskripsi Welcoming Reward</Label><Input value={form.welcomingText} onChange={e => setForm({...form, welcomingText: e.target.value})} className="mt-1" placeholder="Diskon 10% untuk pembelian pertama" /></div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Kembali</Button>
              <Button variant="amber" onClick={() => setStep(3)} className="flex-1" disabled={!form.rewardText}>Lanjut</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="font-syne font-bold text-2xl text-[#1C1C1C]">Pilih Tampilan</h1>
            <div>
              <Label className="mb-2 block">Page Theme</Label>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map(t => (
                  <button key={t.id} onClick={() => setForm({...form, themeId: t.id})}
                    className={`p-3 rounded-xl border-2 transition-colors ${form.themeId === t.id ? "border-[#E8A838]" : "border-[#E8E2D8]"}`}>
                    <div className="w-full h-8 rounded-lg mb-2" style={{ background: t.color }} />
                    <span className="text-xs text-[#888]">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 block">Stamp Design</Label>
              <div className="grid grid-cols-3 gap-2">
                {DESIGNS.map(d => (
                  <button key={d.id} onClick={() => setForm({...form, stampDesignId: d.id})}
                    className={`p-3 rounded-xl border-2 text-center transition-colors ${form.stampDesignId === d.id ? "border-[#E8A838]" : "border-[#E8E2D8]"}`}>
                    <div className="text-2xl mb-1">{d.emoji}</div>
                    <span className="text-xs text-[#888]">{d.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">Kembali</Button>
              <Button variant="amber" onClick={() => setStep(4)} className="flex-1">Lanjut</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h1 className="font-syne font-bold text-2xl text-[#1C1C1C]">Siap Launch! 🚀</h1>
            <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 space-y-3">
              {[
                ["Nama Bisnis", form.name],
                ["Kategori", `${form.category} · ${form.city}`],
                ["Stamp Policy", `${form.stampCount} stamp → ${form.rewardText}`],
                ["Validity", `${form.validityMonths} bulan`],
                ["Theme", THEMES.find(t => t.id === form.themeId)?.name],
                ["Stamp Design", DESIGNS.find(d => d.id === form.stampDesignId)?.name],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm border-b border-[#F5F2EC] pb-2">
                  <span className="text-[#888]">{label}</span>
                  <span className="font-medium text-[#1C1C1C]">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)} className="flex-1">Kembali</Button>
              <Button variant="amber" onClick={handleSubmit} className="flex-1" disabled={loading}>{loading ? "Membuat..." : "Launch Program"}</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
