"use client"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/home"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isGoogleOnly = !searchParams.get("tenant")

  async function handleGoogle() {
    setLoading(true)
    await signIn("google", { callbackUrl })
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await signIn("tenant-credentials", { email, password, redirect: false })
    if (res?.error) {
      setError("Email atau password salah")
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#1C1C1C] rounded-lg flex items-center justify-center">
              <span className="text-[#E8A838] font-bold font-syne">St</span>
            </div>
            <span className="font-syne font-bold text-xl">stample.id</span>
          </div>
        </div>

        <div className="bg-white border border-[#E8E2D8] rounded-2xl p-8">
          <h1 className="font-syne font-bold text-xl text-center mb-6">Masuk ke akun</h1>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">{error}</div>
          )}

          <Button onClick={handleGoogle} variant="outline" className="w-full mb-4" disabled={loading}>
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Lanjut dengan Google
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8E2D8]" />
            </div>
            <div className="relative flex justify-center text-xs text-[#888]">
              <span className="bg-white px-2">atau masuk dengan email</span>
            </div>
          </div>

          <form onSubmit={handleCredentials} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" placeholder="email@kamu.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Memuat..." : "Masuk"}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <Link href="/auth/forgot-password" className="text-sm text-[#888] hover:text-[#1C1C1C]">
              Lupa password?
            </Link>
            <p className="text-sm text-[#888]">
              Belum punya akun?{" "}
              <Link href="/auth/register" className="text-[#1C1C1C] font-medium hover:underline">Daftar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
