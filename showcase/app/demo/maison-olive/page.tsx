import type { Metadata } from 'next'
import { MaisonOlivePage } from '@/components/maison-olive/MaisonOlivePage'

export const metadata: Metadata = {
  title: 'La Maison des Olives | Nice',
  description: 'Cuisine mediterraneenne de saison — producteurs locaux au coeur de Nice.',
}

export default function Page() {
  return <MaisonOlivePage />
}
