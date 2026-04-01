import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ChatWidgetContainer } from "@/components/chat-widget";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AzurSysTech",
  description: "IT-помощь для малого бизнеса и частных клиентов в Nice и рядом.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-[#F6F1E8] text-[#1F2A37]">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <ChatWidgetContainer />
        </div>
      </body>
    </html>
  );
}
