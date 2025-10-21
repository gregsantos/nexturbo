import type {Metadata} from "next"
import {Geist, Geist_Mono} from "next/font/google"
import {ThemeProvider} from "@/components/shared"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Next.js 15 Starter",
  description:
    "A modern Next.js 15 starter with TypeScript, Tailwind CSS, shadcn/ui, BetterAuth, and Drizzle ORM",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className='dark' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
