import type { Metadata } from 'next'

import { AssuranceAvisPage } from './AssuranceAvisPage'

export const metadata: Metadata = {
  title: 'Avis clients | Paul Clément Assurance',
  description:
    "Témoignages de clients satisfaits par l'accompagnement assurance de Paul Clément.",
}

export default function Page() {
  return <AssuranceAvisPage />
}
