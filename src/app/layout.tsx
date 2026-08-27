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
      <body className="min-h-full flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-squircle-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
