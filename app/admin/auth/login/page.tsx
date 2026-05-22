"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) router.push("/dashboard")
    else { setError("Email atau password salah"); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-10 h-10 bg-[#E8A838] rounded-lg flex items-center justify-center mx-auto mb-3">
            <span className="font-syne font-bold text-[#0F0F0F]">St</span>
          </div>
          <h1 className="font-syne font-bold text-white text-xl">Admin Panel</h1>
          <p className="text-[#555] text-sm mt-1">stample.id</p>
        </div>
        <div className="bg-[#141414] border border-[#1E1E1E] rounded-2xl p-8">
          {error && <div className="bg-red-900/30 text-red-400 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label className="text-[#AAA]">Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 bg-[#0A0A0A] border-[#2A2A2A] text-white" required /></div>
            <div><Label className="text-[#AAA]">Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 bg-[#0A0A0A] border-[#2A2A2A] text-white" required /></div>
            <Button type="submit" variant="amber" className="w-full" disabled={loading}>{loading ? "Memuat..." : "Masuk"}</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
