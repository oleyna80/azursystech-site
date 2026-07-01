import type { Metadata } from 'next'

import { AssuranceAProposPage } from './AssuranceAProposPage'

export const metadata: Metadata = {
  title: "Qui suis-je | Paul Clément Assurance",
  description:
    "Découvrez Paul Clément, agent d'assurance indépendant, son parcours, ses valeurs et son accompagnement client.",
}

export default function Page() {
  return <AssuranceAProposPage />
}
