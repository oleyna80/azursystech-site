import type { Metadata } from 'next'
import { DemoReturnLink } from '@/demo-kit/layout/DemoReturnLink'

export const metadata: Metadata = {
  title: 'Cabinet Comptable | Comptabilité Professionnelle',
  description: 'Cabinet de comptabilité - Démonstration en cours de développement.',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
      <DemoReturnLink />
    </div>
  )
}
