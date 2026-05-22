import type { Metadata } from "next"
import { DM_Sans, Syne } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400", "600", "700", "800"] })

export const metadata: Metadata = {
  title: "stample.id — Digital Loyalty Card",
  description: "Kumpulkan stamp, dapat reward. Platform loyalitas digital untuk FnB Indonesia.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${dmSans.variable} ${syne.variable} antialiased`}>{children}</body>
    </html>
  )
}
