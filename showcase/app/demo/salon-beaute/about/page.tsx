import type { Metadata } from 'next'
import { SalonBeauteAbout } from '@/components/salon-beaute/HomePage'

export const metadata: Metadata = {
  title: 'À propos de Salon de Beauté — Salon de Beauté | AzurSysTech Showcase',
  description:
    'Découvrez Salon de Beauté, son équipe, sa philosophie, son univers et les avis de ses clientes.',
}

export default function Page() {
  return <SalonBeauteAbout />
}
