import type { Metadata } from 'next'
import { SalonBeauteServices } from '@/components/salon-beaute/HomePage'

export const metadata: Metadata = {
  title: 'Nos services beauté — Salon de Beauté | AzurSysTech Showcase',
  description:
    'Prestations de salon de beauté à Paris : coiffure, coloration, soins du visage, manucure, pédicure et épilation.',
}

export default function Page() {
  return <SalonBeauteServices />
}
