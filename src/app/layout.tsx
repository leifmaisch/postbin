import type { Metadata } from "next"

import { leguanFontVariables } from "@/lib/fonts"

import "./globals.css"

export const metadata: Metadata = {
  title: "Postbin",
  description: "Inspect HTTP requests in real time",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${leguanFontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col overflow-x-hidden supports-[padding:max(0px)]:pb-[max(0px,env(safe-area-inset-bottom))]">
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
