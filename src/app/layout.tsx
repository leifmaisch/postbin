import type { Metadata } from "next"

import { leguanFontVariables } from "@/lib/fonts"

import "./globals.css"

export const metadata: Metadata = {
  title: "Postbin",
  description: "Inspect HTTP requests in real time",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${leguanFontVariables} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
