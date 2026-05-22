"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function ReferralClient({ referralLink }: { referralLink: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-[#E8E2D8] rounded-2xl p-5 space-y-3">
      <p className="text-xs text-[#888] font-semibold uppercase tracking-wide">Link Referral Kamu</p>
      <div className="flex items-center gap-2 bg-[#F5F2EC] rounded-xl p-3">
        <span className="text-xs font-mono text-[#888] flex-1 truncate">{referralLink}</span>
      </div>
      <Button variant="amber" className="w-full" onClick={handleCopy}>
        {copied ? "✓ Tersalin!" : "📋 Salin Link"}
      </Button>
    </div>
  )
}
