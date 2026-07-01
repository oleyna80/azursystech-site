import type { Metadata } from 'next'

import { AssuranceFaqPage } from './AssuranceFaqPage'

export const metadata: Metadata = {
  title: 'FAQ | Paul Clément Assurance',
  description:
    "Réponses aux questions fréquentes sur l'assurance auto, habitation, santé, résiliation et indemnisation.",
}

export default function Page() {
  return <AssuranceFaqPage />
}
