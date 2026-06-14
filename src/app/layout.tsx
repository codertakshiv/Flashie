import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://flashie.app";

export const metadata: Metadata = {
  title: {
    default: "Flashie - Browser-Based Firmware Flashing Platform",
    template: "%s | Flashie",
  },
  description:
    "Flash firmware to ESP32, ESP8266, STM32, and Arduino boards directly from Chrome or Edge. No desktop software required.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Flashie - Browser-Based Firmware Flashing Platform",
    description:
      "Flash firmware directly from your browser. No desktop software required.",
    url: siteUrl,
    siteName: "Flashie",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flashie - Browser-Based Firmware Flashing Platform",
    description:
      "Flash firmware directly from your browser. No desktop software required.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <script
          type="module"
          src="https://unpkg.com/esp-web-tools@10/dist/web/install-button.js?module"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
