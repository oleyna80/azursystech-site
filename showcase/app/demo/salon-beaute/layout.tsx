import { Playfair_Display, Inter } from 'next/font/google'
import type { Metadata } from 'next'
import { DemoReturnLink } from '@/demo-kit/layout/DemoReturnLink'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--sb-font-heading',
  weight: ['400', '500', '600', '700'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--sb-font-body',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Salon de Beauté | AzurSysTech Showcase',
  description:
    'Salon de beauté à Paris : coiffure, coloration, soins du visage, manucure, épilation et demande de rendez-vous.',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${playfair.variable} ${inter.variable}`}>
      {children}
      <DemoReturnLink />
    </div>
  )
}
