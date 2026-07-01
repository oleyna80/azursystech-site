import type { Metadata } from 'next'

import { AssuranceMentionsLegalesPage } from './AssuranceMentionsLegalesPage'

export const metadata: Metadata = {
  title: "Mentions légales | Paul Clément Assurance",
  description:
    "Mentions légales, politique de confidentialité et gestion des cookies du démo Paul Clément Agent d'Assurance.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function Page() {
  return <AssuranceMentionsLegalesPage />
}
