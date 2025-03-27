import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { locales, Locale } from "../../../i18n.config"
import "../globals.css"
import { Toaster } from "sonner"
import { CloudinaryScript } from "@/components/CloudinaryScript"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ace Tour",
  description: "Ace Tour - Your Travel Partner",
}

async function getMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default
  } catch (error) {
    notFound()
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound()

  const messages = await getMessages(locale)

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Navbar lang={locale} />
      <main className={inter.className}>
        {children}
      </main>
      <Footer />
      <Toaster />
      <CloudinaryScript />
    </NextIntlClientProvider>
  )
} 