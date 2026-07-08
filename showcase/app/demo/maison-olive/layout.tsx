import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import { DemoReturnLink } from '@/demo-kit/layout/DemoReturnLink'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--mo-font-heading',
  weight: ['300', '400', '500', '600'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--mo-font-body',
  weight: ['300', '400', '500', '600'],
})

export default function MaisonOliveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style>{`
        :root {
          --mo-font-heading: ${cormorant.style?.fontFamily || "'Cormorant Garamond'"};
          --mo-font-body: ${dmSans.style?.fontFamily || "'DM Sans'"};
        }
      `}</style>
      {children}
      <DemoReturnLink />
    </>
  )
}
