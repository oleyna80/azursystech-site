import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import { DemoReturnLink } from '@/demo-kit/layout/DemoReturnLink'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--pl-font-heading',
  weight: ['400', '500', '600', '700'],
})

const plusjksans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--pl-font-body',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Plomberie Pro | AzurSysTech Showcase',
  description:
    'Plombiers certifiés en Île-de-France: dépannage urgent, réparation, installation, rénovation, chauffage et maintenance.',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`${outfit.variable} ${plusjksans.variable}`}>
      {children}
      <DemoReturnLink />
    </div>
  )
}
