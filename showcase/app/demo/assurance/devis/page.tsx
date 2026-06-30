import type { Metadata } from 'next'

import { AssuranceDevisPage } from './AssuranceDevisPage'

export const metadata: Metadata = {
  title: "Demander un devis | Paul Clement",
  description:
    "Demande de devis demo pour le site assurance Paul Clement, sans envoi externe ni backend.",
}

export default function Page() {
  return <AssuranceDevisPage />
}
