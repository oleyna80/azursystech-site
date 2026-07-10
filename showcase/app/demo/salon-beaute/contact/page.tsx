import type { Metadata } from 'next'
import { SalonBeauteContact } from '@/components/salon-beaute/HomePage'

export const metadata: Metadata = {
  title: 'Contactez Salon de Beauté — Salon de Beauté | AzurSysTech Showcase',
  description:
    'Coordonnées, horaires, carte stylisée et formulaire de demande de rendez-vous pour Salon de Beauté à Paris.',
}

export default function Page() {
  return <SalonBeauteContact />
}
