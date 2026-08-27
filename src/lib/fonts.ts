import { Geist_Mono, Rubik } from "next/font/google"

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const leguanFontVariables = [rubik.variable, geistMono.variable].join(" ")
