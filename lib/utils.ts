import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateTransferCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = "STM-"
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function generateUniqueCode(): number {
  return Math.floor(Math.random() * 900) + 100
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getPlanPrice(plan: string, period: string): number {
  const prices: Record<string, Record<string, number>> = {
    pro: { monthly: 49000, yearly: 499000 },
    premium: { monthly: 89000, yearly: 899000 },
  }
  return prices[plan]?.[period] ?? 0
}

export function getPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    premium: "Premium",
  }
  return labels[plan] ?? plan
}
