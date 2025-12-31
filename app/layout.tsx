import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Zee Dashboard",
  description: "Premium Clash Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="flex h-screen bg-background text-foreground antialiased selection:bg-blue-500/30">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto overflow-x-hidden relative">
          <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
            <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />
          </div>

          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

