import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { FinanceProvider } from "@/app/contexts/FinanceContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Personal Finance Tracker",
  description: "Track your income and expenses with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FinanceProvider>
          {children}
          <Toaster />
        </FinanceProvider>
      </body>
    </html>
  )
}

