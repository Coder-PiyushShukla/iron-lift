import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar" // <--- Import the Navbar
import SessionProvider from "../components/session-provider" // Assuming you have this wrapper

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
      <body className={inter.className}>
        <SessionProvider>
          <Navbar /> {/* <--- ADD THIS LINE HERE */}
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}