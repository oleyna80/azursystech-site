import { Libre_Caslon_Text, DM_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import { DemoReturnLink } from '@/demo-kit/layout/DemoReturnLink'

const librecaston = Libre_Caslon_Text({
  subsets: ['latin'],
  variable: '--bx-font-heading',
  weight: '400',
})

const dmsans = DM_Sans({
  subsets: ['latin'],
  variable: '--bx-font-body',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  title: 'Atelier Liora | Bijoux Artisanaux',
  description: 'Bijoux artisanaux façonnés à la main avec soin et passion.',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`
        :root {
          --bx-font-heading: ${librecaston.style?.fontFamily || "'Libre Caslon Text'"};
          --bx-font-body: ${dmsans.style?.fontFamily || "'DM Sans'"};
        }
      `}</style>
      {children}
      <DemoReturnLink />
    </>
  )
}
