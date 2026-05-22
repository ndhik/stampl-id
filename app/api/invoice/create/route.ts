import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { generateTransferCode, generateUniqueCode, getPlanPrice } from "@/lib/utils"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.tenantId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { plan, period } = await req.json()
    if (!["pro", "premium"].includes(plan)) {
      return NextResponse.json({ error: "Plan tidak valid" }, { status: 400 })
    }

    const amount = getPlanPrice(plan, period)
    const uniqueCode = generateUniqueCode()
    const transferCode = generateTransferCode()
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

    const invoice = await db.invoice.create({
      data: {
        tenantId: session.user.tenantId,
        plan,
        period,
        amount,
        uniqueCode,
        transferCode,
        expiresAt,
      },
    })

    return NextResponse.json({
      id: invoice.id,
      transferCode: invoice.transferCode,
      amount: invoice.amount,
      uniqueCode: invoice.uniqueCode,
      totalAmount: invoice.amount + invoice.uniqueCode,
      bankName: process.env.BANK_NAME,
      bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER,
      bankAccountName: process.env.BANK_ACCOUNT_NAME,
      whatsappNumber: process.env.WHATSAPP_CONFIRM_NUMBER,
      expiresAt: invoice.expiresAt,
    })
  } catch {
    return NextResponse.json({ error: "Gagal" }, { status: 500 })
  }
}
