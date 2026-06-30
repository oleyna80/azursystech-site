import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AzurSysTech Showcase',
  description: 'Демо-сайты AzurSysTech для разных ниш и сценариев автоматизации.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
