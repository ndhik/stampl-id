"use client"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

interface Props { tenantName: string; profileUrl: string }

export default function QrDownloadClient({ tenantName, profileUrl }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
    script.onload = () => {
      const container = document.getElementById("qr-container")
      if (container && (window as any).QRCode) {
        container.innerHTML = ""
        new (window as any).QRCode(container, {
          text: profileUrl,
          width: 256,
          height: 256,
          colorDark: "#1C1C1C",
          colorLight: "#FFFFFF",
          correctLevel: (window as any).QRCode.CorrectLevel.H,
        })
      }
    }
    document.head.appendChild(script)
    return () => { document.head.removeChild(script) }
  }, [profileUrl])

  function handleDownload() {
    const img = document.querySelector("#qr-container img") as HTMLImageElement
    if (!img) return
    const canvas = document.createElement("canvas")
    const padding = 48
    canvas.width = 256 + padding * 2
    canvas.height = 256 + padding * 2 + 60
    const ctx = canvas.getContext("2d")!
    ctx.fillStyle = "#FFFFFF"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, padding, padding, 256, 256)
    ctx.fillStyle = "#1C1C1C"
    ctx.font = "bold 18px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(tenantName, canvas.width / 2, 256 + padding + 32)
    ctx.fillStyle = "#888888"
    ctx.font = "13px sans-serif"
    ctx.fillText("Scan untuk kumpulkan stamp", canvas.width / 2, 256 + padding + 52)
    const link = document.createElement("a")
    link.download = `qr-${tenantName.toLowerCase().replace(/\s+/g, "-")}.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#E8E2D8] rounded-2xl p-8 flex flex-col items-center gap-4">
        <div id="qr-container" className="w-64 h-64 flex items-center justify-center" />
        <div className="text-center">
          <p className="font-syne font-bold text-[#1C1C1C]">{tenantName}</p>
          <p className="text-xs text-[#888] mt-1 font-mono break-all">{profileUrl}</p>
        </div>
      </div>
      <Button variant="amber" className="w-full" onClick={handleDownload}>
        📥 Download QR Code (PNG)
      </Button>
      <div className="bg-[#F5F2EC] rounded-xl p-4 text-sm text-[#888] space-y-1">
        <p className="font-semibold text-[#1C1C1C]">Tips pemasangan:</p>
        <p>• Print ukuran A5 untuk ditempel di meja kasir</p>
        <p>• Print ukuran kecil untuk stiker di meja atau tray</p>
        <p>• Laminating agar tahan air dan tidak mudah rusak</p>
      </div>
    </div>
  )
}
