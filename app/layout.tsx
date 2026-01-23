import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import SessionProvider from "../components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Iron Lift",
  description: "AI Powered Fitness",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <SessionProvider>
          <Navbar />
          {/* Added pb-20 so mobile bottom bar doesn't cover content */}
          <main className="pb-20 md:pb-0">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  )
}