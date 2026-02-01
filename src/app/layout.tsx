import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/providers/theme-provider"

import "@/styles/globals.css"

// Apple font imports
const appleFont = `
  @font-face {
    font-family: 'SF Pro Display';
    src: url('https://developer.apple.com/fonts/SF-Pro-Display-Regular.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'SF Pro Display';
    src: url('https://developer.apple.com/fonts/SF-Pro-Display-Medium.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'SF Pro Display';
    src: url('https://developer.apple.com/fonts/SF-Pro-Display-Semibold.woff2') format('woff2');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'SF Pro Display';
    src: url('https://developer.apple.com/fonts/SF-Pro-Display-Bold.woff2') format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
`

export const metadata: Metadata = {
  title: "LabelPro - Professional Label Resizing for E-commerce",
  description:
    "The complete platform for e-commerce label management. 255+ label formats for Amazon FBA, Walmart, eBay, Shopify and more.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "16x16 32x32",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{ __html: appleFont }} />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
