import { Analytics } from "@vercel/analytics/react"

import { Providers } from "@/components/providers"

import "./globals.css"

import type { Metadata } from "next"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const runtime = "edge"

export const metadata: Metadata = {
  title: "CommodityAI",
  description: "Automated commodity trading workflows.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className="h-full w-full overflow-hidden"
      suppressHydrationWarning
    >
      <body className={inter.className + " w-full h-full"}>
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  )
}
