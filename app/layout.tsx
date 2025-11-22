import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/sonner"
import AppProvider from "@/app/app-provider"
import { cookies } from "next/headers"
import SlideSession from "@/components/slide-session"
import accountApiRequest from "@/api-requests/account"
import { AccountResType } from "@/schemaValidations/account.schema"

const inter = Inter({
  subsets: ["vietnamese"],
})

export const metadata: Metadata = {
  title: {
    template: "%s | Productic",
    default: "Productic",
  },
  description: "Được tạo bởi Tôi",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const me: AccountResType["data"] | null = null

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider me={me}>
            <Header me={me} />
            {children}
            <SlideSession />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
