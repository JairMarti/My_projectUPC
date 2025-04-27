import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PointsProvider } from "@/context/points-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EcoKids - Aprende a cuidar el planeta",
  description: "Una app educativa para que los niños aprendan sobre el medio ambiente",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <PointsProvider>{children}</PointsProvider>
      </body>
    </html>
  )
}



import './globals.css'