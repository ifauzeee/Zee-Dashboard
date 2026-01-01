import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Zee Dashboard",
  description: "A modern, beautiful dashboard for Clash/Mihomo proxy client",
  manifest: "/manifest.json",
  keywords: ["clash", "mihomo", "dashboard", "proxy", "vpn"],
  authors: [{ name: "Zee" }],
  openGraph: {
    title: "Zee Dashboard",
    description: "A modern, beautiful dashboard for Clash/Mihomo proxy client",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ZeeBoard",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="flex h-screen bg-background text-foreground antialiased selection:bg-blue-500/30">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <Sidebar />
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
              <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
              </div>

              <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
                {children}
              </div>
            </main>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
