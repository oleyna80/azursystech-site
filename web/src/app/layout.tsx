import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies, headers } from "next/headers";
import Script from "next/script";
import { ChatWidgetContainer } from "@/components/chat-widget";
import { ErrorBoundary } from "@/components/error-boundary";
import { SiteFooter } from "@/components/shell/site-footer";
import { SiteHeader } from "@/components/shell/site-header";
import { DEFAULT_LOCALE, getPageMeta, LOCALE_COOKIE_KEY, resolveLocale } from "@/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultMeta = getPageMeta(DEFAULT_LOCALE, "/");

export const metadata: Metadata = {
  title: defaultMeta.title,
  description: defaultMeta.description,
};

type ShellLocale = "fr" | "ru" | "en";

function resolveShellLocale(routeLocale: string | null, cookieLocale: string | undefined): ShellLocale {
  if (routeLocale === "fr" || routeLocale === "ru" || routeLocale === "en") {
    return routeLocale;
  }

  return resolveLocale(cookieLocale) === "ru" ? "ru" : "fr";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const requestHeaders = await headers();
  const locale = resolveShellLocale(
    requestHeaders.get("x-azursystech-route-locale"),
    cookieStore.get(LOCALE_COOKIE_KEY)?.value,
  );

  return (
    <html lang={locale}>
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-J4Y77YBQMC"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J4Y77YBQMC');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-[#F6F1E8] text-[#1F2A37]">
          <SiteHeader initialLocale={locale} />
          <div className="flex-1">{children}</div>
          <SiteFooter locale={locale} />
          {locale !== "en" ? (
            <ErrorBoundary label="chat-widget">
              <ChatWidgetContainer />
            </ErrorBoundary>
          ) : null}
        </div>
      </body>
    </html>
  );
}
