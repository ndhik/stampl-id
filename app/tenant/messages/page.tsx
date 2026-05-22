"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"

type Message = { id: string; content: string; sentAt: string; _count: { reads: number } }

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    fetch("/api/tenant/messages").then(r => r.json()).then(setMessages)
  }, [])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await fetch("/api/tenant/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    })
    setSent(true)
    setContent("")
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-[#F5F2EC] p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="font-syne font-bold text-2xl text-[#1C1C1C] mb-6">Pesan ke Member</h1>

        <Card className="mb-6">
          <CardContent className="p-5">
            <p className="text-sm text-[#888] mb-3">Pesan akan masuk ke inbox semua member yang terdaftar.</p>
            {sent && <div className="bg-[#E6F4EA] text-[#2D7D46] text-sm px-3 py-2 rounded-lg mb-3">✓ Pesan terkirim!</div>}
            <form onSubmit={handleSend} className="space-y-3">
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={4}
                className="w-full px-3 py-2 border border-[#E8E2D8] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#E8A838]"
                placeholder="Tulis pesan atau promo untuk member kamu..." required />
              <Button type="submit" variant="amber" className="w-full" disabled={sending || !content}>
                {sending ? "Mengirim..." : "Kirim ke Semua Member"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <h2 className="font-syne font-semibold text-[#1C1C1C] mb-3">Riwayat Pesan</h2>
        <div className="space-y-3">
          {messages.map(m => (
            <Card key={m.id}>
              <CardContent className="p-4">
                <p className="text-sm text-[#1C1C1C] mb-2">{m.content}</p>
                <p className="text-xs text-[#888]">{formatDistanceToNow(new Date(m.sentAt), { addSuffix: true, locale: id })}</p>
              </CardContent>
            </Card>
          ))}
          {messages.length === 0 && <p className="text-sm text-[#888] text-center py-4">Belum ada pesan terkirim.</p>}
        </div>
      </div>
    </div>
  )
}
